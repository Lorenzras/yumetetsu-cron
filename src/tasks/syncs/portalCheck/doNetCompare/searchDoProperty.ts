/* eslint-disable max-len */
import retry from 'async-retry';
import {Page} from 'puppeteer';
import {getFileName, logger, spreadAddress} from '../../../../utils';
import {login} from '../../../common/doNet';
import {navigateToPropertyPage} from '../../../common/doNet/pages/navigate';
import {
  setPropertyStatus,
  setPropertyTypes,
  TPropTypes} from '../../../common/doNet/pages/properties';
import {cityLists, dlImg, kintoneAppId} from '../config';
import {PropertyType} from '../types';
import {compareData} from './compareData';

export interface IPropSearchData {
  propertyType: PropertyType,
  address: string,
  price: string,
  area: string,
}

enum propTypeVals {
  '中古戸建' = 'used_kodate',
  '土地' = 'tochi',
  '中古マンション' = 'used_mansion'
}

export const selectByText = async (
  page: Page,
  selector: string,
  text: string,
) => {
  await page.waitForSelector(`${selector} option`);
  await page.$eval(selector, (el, text) => {
    const prefId = $(el)
      .children(`option:contains(${text})`).val() as string;
    $(el).val(prefId);
    $(el).trigger('change');
    return prefId;
  }, text);

  // await page.select(selector, shopStoreId);
};

export const setLocation = async (
  {page, data}:
  {
    page: Page,
    data: {
      pref: string,
      city: string,
      town: string,
    }
  }) => {
  const {pref, city, town} = data;
  await retry(async ()=>{
    logger.info(`Setting location. ${pref} ${city} ${town}`);
    /* Open modal */
    await page.waitForSelector('#select_button_city1');
    await page.click('#select_button_city1');


    await selectByText(page, '#select_pref_id', pref );

    await page.type('#modal_city_name_autocomplete', city);

    /* Town field is disabled until triggering blur event on city field */
    await page.$eval(
      '#modal_city_name_autocomplete', (e) => {
        $(e).trigger('blur');
        $('#modal_town_name_autocomplete').trigger('focus');
      });

    if (town) {
      return page.waitForSelector(
        '#modal_town_name_autocomplete:not(:disabled)',
        {timeout: 5000},
      )
        .then(()=>{
          return page.type('#modal_town_name_autocomplete', town);
        })
        .catch(()=>{
          logger.error('Failed to type town');
          throw new Error('Failed to type town');
        });
    }

    await page.click('#modal_ok_button');
    await page.waitForSelector('#select_pref_id', {hidden: true});
  }, {
    retries: 3,
    onRetry: async (e, tries) => {
      logger.error(`Failed. Retrying to populate location form. ${e.message} Attempt: ${tries}`);
      await page.click('#modal_clear_button');
    },
  });
};

const setLotArea = async (page: Page, area: string) => {
  await page.evaluate((area)=> {
    $('#m_estate_filters_floor_space_lower').val(area);
    $('#m_estate_filters_floor_space_upper').val(area);
  }, area);
};


export const searchDoProperty = async ({
  page, data,
}:{
  page: Page,
  data: IPropSearchData
}) => {
  const {address, area, propertyType} = data;
  const {都道府県: pref, 市区: city, 町域: town} = spreadAddress(address);
  const shopName = cityLists[pref][city];
  const propType : TPropTypes = propTypeVals[propertyType];

  const result = await retry(async () => {
    logger.info('Starting search ' + JSON.stringify(data));
    await login(page);
    await navigateToPropertyPage(page);
    await page.waitForSelector('#m_estate_filters_fc_shop_id option');

    /* Select store */
    await selectByText(page, '#m_estate_filters_fc_shop_id', shopName);

    await setPropertyTypes(page, [propType]);
    await setPropertyStatus(page);

    await setLocation({
      page,
      data: {
        pref, city, town,
      }},
    );

    await setLotArea(page, area);

    await Promise.all([
      page.waitForNavigation(),
      page.click('#btn_search'),
    ]);

    return await compareData(page, data);
  }, {
    retries: 3,
    onRetry: async (e, attempt) => {
      logger.error(`Retrying doNetCompare with ${attempt} attempts.`);
      await page.screenshot({path: getFileName({
        dir: dlImg,
        appId: kintoneAppId,
        suffix: `attempts(${attempt})`,
        ext: 'png',
      })});
    },
  });

  return result;
};

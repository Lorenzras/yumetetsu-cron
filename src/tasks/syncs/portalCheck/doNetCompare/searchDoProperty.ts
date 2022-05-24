/* eslint-disable max-len */
import retry from 'async-retry';
import {Page} from 'puppeteer';
import {getFileName, logger, spreadAddress} from '../../../../utils';
import {blockImages} from '../../../common/browser';
import {login} from '../../../common/doNet';
import {navigateToPropertyPage} from '../../../common/doNet/pages/navigate';
import {
  setPropertyStatus,
  setPropertyTypes,
  TPropTypes} from '../../../common/doNet/pages/properties';
import {cityLists, dlImg, kintoneAppId} from '../config';
import {PropertyType} from '../types';
import {compareData} from './compareData';
import {setLocation} from './setLocation';

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
  const prefId = await page.$eval(selector, (el, text) => {
    const prefId = $(el)
      .children(`option:contains(${text})`).val() as string;
    // $(el).val(prefId);
    // $(el).trigger('change');
    return prefId;
  }, text);

  await page.select(selector, prefId);
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
  page.removeAllListeners();
  await blockImages(page);

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

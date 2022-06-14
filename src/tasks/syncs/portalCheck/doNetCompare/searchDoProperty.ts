/* eslint-disable max-len */
import retry from 'async-retry';
import {Page} from 'puppeteer';
import {logger, spreadAddress} from '../../../../utils';

import {login} from '../../../common/doNet';
import {navigateToPropertyPage} from '../../../common/doNet/pages/navigate';
import {
  setPropertyStatus,
  setPropertyTypes,
  TPropTypes} from '../../../common/doNet/pages/properties';
import {cityLists} from '../config';
import {logErrorScreenshot} from '../helpers/logErrorScreenshot';
import {IHouse, ILot, IMansion, IProperty, TProperty, TPropertyConvert} from '../types';
import {compareData, TSearchResult} from './compareData';
import {setLocation} from './setLocation';

export interface IPropSearchData {
  propertyType: TProperty,
  address: string,
  price: string,
  area: string,
}

const doPropTypes: TPropertyConvert<TPropTypes> = {
  中古戸建: 'used_kodate',
  土地: 'tochi',
  中古マンション: 'used_mansion',
};

export const selectByText = async (
  page: Page,
  selector: string,
  text: string,
) => {
  await page.waitForSelector(`${selector} option`);
  // await page.waitForTimeout(2000);
  logger.info(`${selector} appeared.`);
  const prefId = await page.$eval(selector, (el, text) => {
    const prefId = $(el)
      .children(`option:contains(${text})`).val() as string;
    (el as HTMLInputElement).value = prefId;
    // $(el).val(prefId);
    $(el).trigger('change');
    return prefId;
  }, text);


  // await page.select(selector, prefId);
  logger.info(`Selected  ${prefId} at ${selector}.`);
};

const setLotArea = async (page: Page, area: string) => {
  await page.evaluate((area)=> {
    $('#m_estate_filters_floor_space_lower').val(area);
    $('#m_estate_filters_floor_space_upper').val(area);
  }, area);
};


export const searchDoProperty = async ({
  page, inputData, logSuffix,
}:{
  page: Page,
  inputData: IProperty | IHouse | IMansion | ILot,
  logSuffix: string
}) => {
  const {
    所在地: address,
    物件種別: propertyType = '中古戸建',
  } = inputData;
  let area = '';

  let result: TSearchResult[] = [];
  page.setDefaultTimeout(40000);

  try {
    if ('比較用土地面積' in inputData) {
      area = inputData.比較用土地面積.toString();
    } else if ('比較用専有面積' in inputData) {
      area = inputData.比較用専有面積.toString();
    }

    const {都道府県: pref, 市区: city, 町域: town} = spreadAddress(address);
    const shopName = cityLists[pref][city];
    const propType : TPropTypes = doPropTypes[propertyType];


    result = await retry(async () => {
      logger.info('Checking donet page type.');
      await Promise.race([
        page.waitForSelector('.btn_login'),
        page.waitForSelector('#m_estate_filters_fc_shop_id option'),
        page.waitForSelector('body div', {hidden: true}),
        page.waitForSelector('.error_navi td#error_area'),
      ]);

      logger.info(`${logSuffix} is starting donet compare.`);
      if (!await page.$('#m_estate_filters_fc_shop_id option')) {
        await login(page);
        await navigateToPropertyPage(page);
      }

      await page.waitForSelector('#m_estate_filters_fc_shop_id option');

      /* Select store */
      await selectByText(page, '#m_estate_filters_fc_shop_id', shopName);

      await setPropertyTypes(page, [propType]);
      await setPropertyStatus(page);

      await setLocation({
        page,
        data: {
          pref, city, town,
        },
        logSuffix,
      });


      await setLotArea(page, area);

      logger.info(`${logSuffix} clicked search.`);
      await Promise.all([
        page.waitForNavigation(),
        page.click('#btn_search'),
      ]);

      logger.info(`${logSuffix} is comparing data.`);
      const comparedData = await compareData(page, inputData);
      logger.info(`${logSuffix} is done comparing against ${comparedData.length} properties`);

      return comparedData;
    }, {
      retries: 3,

      onRetry: async (e, attempt) => {
        logger.warn(`${logSuffix} retried ${attempt} times to compare data.  ${e.message}`);
      },
    });
  } catch (err: any) {
    await logErrorScreenshot(page, `${logSuffix} did its best but still failed to compare data.  ${err.message} `);
    throw new Error('Failed to compare data.');
  }

  return result;
};

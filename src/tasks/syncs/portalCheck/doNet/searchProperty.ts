import {Page} from 'puppeteer';
import {logger, spreadAddress} from '../../../../utils';
import {
  setPropertyTypes,
  TPropTypes} from '../../../common/doNet/pages/properties';
import {cityLists} from '../config';
import {IProperty, PropertyType} from '../types';

interface ISearchData {
  propertyType: PropertyType,
  address: string,
  price: number,
  area: number,
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
    const shopStoreId = $(el)
      .children(`option:contains(${text})`).val();
    $(el).val(shopStoreId as string);
  }, text);
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
  try {
    console.log(data);
    await page.waitForSelector('#select_button_city1');
    await page.click('#select_button_city1');

    // await page.waitForSelector('#select_pref_id option');
    await selectByText(page, '#select_pref_id', pref );
    await page.type('#modal_city_name_autocomplete', city);

    await page.waitForSelector('#modal_town_name_autocomplete:not(:disabled)');
    await page.type('#modal_town_name_autocomplete', town);
  } catch (err: any) {
    const errMessage = 'setLocation failed ' + err.message;
    logger.error(errMessage);
    throw new Error(errMessage);
  }
};


export const searchProperty = async ({
  page, data,
}:{
  page: Page,
  data: ISearchData
}) => {
  const {address, area, price, propertyType} = data;
  const {都道府県: pref, 市区: city, 町域: town} = spreadAddress(address);
  const shopName = cityLists[pref][city];
  const propType : TPropTypes = propTypeVals[propertyType];

  await page.waitForSelector('#m_estate_filters_fc_shop_id option');

  /* Select store */
  await selectByText(page, '#m_estate_filters_fc_shop_id', shopName);

  await setPropertyTypes(page, [propType]);

  await setLocation({
    page,
    data: {
      pref, city, town,
    }},
  );
};

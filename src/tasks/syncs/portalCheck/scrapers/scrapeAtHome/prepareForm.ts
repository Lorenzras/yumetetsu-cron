import {logger} from '../../../../../utils';
import {cityLists} from '../../config';
import {THandlePrepareForm, TProperty} from '../../types';


type TPropertyConvert = Record<TProperty, string>

const prefStr = {
  '愛知県': 'aichi',
  '岐阜県': 'gifu',
};

const propTypeStr: TPropertyConvert = {
  土地: 'tochi',
  中古マンション: 'kodate/chuko',
  中古戸建: 'mansion/chuko',

};

const resolveUrl = (pref: keyof typeof prefStr, propType: TProperty) => {
  return `https://www.athome.co.jp/${propTypeStr[propType]}/${prefStr[pref]}/city`;
};

export const prepareForm: THandlePrepareForm = async (page, pref, propType) => {
  const url = resolveUrl(pref as keyof typeof prefStr, propType);
  const cities = Object.keys(cityLists[pref]);
  console.log('cities', cities);
  try {
    await page.goto(url);
    await page.waitForSelector('[data-label="検索結果遷移"]');

    await page.evaluate((cities: string[])=>{
      console.log(cities);
      cities.forEach((item)=>{
        $(`label:contains(${item})`)
          .siblings('input')
          .prop('checked', true);
      });

      $('label:contains(3日以内に公開) input').trigger('click');

    // $('.viewResult a').eq(0).trigger('click');
    }, cities);

    await page.waitForTimeout(4000);

    await Promise.all([
      page.waitForNavigation(),
      page.click('.viewResult a'),
    ]);
    logger.info(`Succesfully navigated to ${url}`);
    return true;
  } catch (err: any) {
    logger.error(`Failed to navigate ${url} ${err.message}`);
    return false;
  }
};

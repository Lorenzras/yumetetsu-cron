import {logger} from '../../../../../utils';
import {cityLists} from '../../config';
import {THandlePrepareForm, TProperty} from '../../types';
import {logErrorScreenshot} from '../helpers/logErrorScreenshot';


type TPropertyConvert = Record<TProperty, string>

const prefStr = {
  '愛知県': 'aichi',
  '岐阜県': 'gifu',
};

const propTypeStr: TPropertyConvert = {
  土地: 'tochi',
  中古マンション: 'mansion/chuko',
  中古戸建: 'kodate/chuko',

};

const resolveUrl = (pref: keyof typeof prefStr, propType: TProperty) => {
  return `https://www.athome.co.jp/${propTypeStr[propType]}/${prefStr[pref]}/city`;
};

export const handlePrepareForm : THandlePrepareForm = async (
  page, pref, propType,
) => {
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
    }, cities);


    await Promise.all([
      page.waitForNavigation(),
      page.click('.viewResult a'),
    ]);

    await page.waitForSelector('#item-list', {timeout: 300000})
      .catch(()=> page.reload());
    logger.info(`Succesfully navigated to ${url}`);
    return true;
  } catch (err: any) {
    await logErrorScreenshot(page, `Failed to navigate ${url} ${err.message}`);
    return false;
  }
};

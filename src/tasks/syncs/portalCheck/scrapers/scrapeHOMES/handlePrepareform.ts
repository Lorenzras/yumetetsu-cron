import {logger} from '../../../../../utils';
import {cityLists} from '../../config';
import {THandlePrepareForm, TProperty} from '../../types';
import {changePublishedRange} from './citiesForm/prepareForm';
import {selectTargetCities} from './citiesForm/selectTargetCities';


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
  return `https://www.homes.co.jp/${propTypeStr[propType]}/${prefStr[pref]}/city`;
};

export const handlePrepareform:
THandlePrepareForm = async (page, pref, propType) => {
  const url = resolveUrl(pref as keyof typeof prefStr, propType);
  const cities = Object.keys(cityLists[pref]);
  const submitSelector = '.prg-goToList:not(:disabled)';
  console.log('cities', cities);
  try {
    await page.goto(url);
    await page.waitForSelector('.prg-goToList');

    await selectTargetCities(page, cities);

    logger.info('Looking for submit.');
    await page.waitForSelector(submitSelector);
    await Promise.all([
      page.waitForNavigation({waitUntil: 'domcontentloaded'}),
      page.click(submitSelector),
    ]);

    logger.info('Changing Publish range.');
    await changePublishedRange(page);


    logger.info(`Succesfully navigated to ${url}`);
    return true;
  } catch (err: any) {
    logger.error(`Failed to navigate ${url} ${err.message}`);
    return false;
  }
};

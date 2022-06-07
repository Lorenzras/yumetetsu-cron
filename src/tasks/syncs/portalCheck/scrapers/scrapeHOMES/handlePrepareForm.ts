import {logger} from '../../../../../utils';
import {cityLists} from '../../config';
import {THandlePrepareForm, TProperty, TPropertyConvert} from '../../types';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';
import {changePublishedRange} from './citiesForm/prepareForm';
import {selectTargetCities} from './citiesForm/selectTargetCities';

// fixed filename casing

const prefStr = {
  '愛知県': 'aichi',
  '岐阜県': 'gifu',
};

const propTypeStr: TPropertyConvert<string> = {
  土地: 'tochi',
  中古マンション: 'mansion/chuko',
  中古戸建: 'kodate/chuko',

};

const resolveUrl = (pref: keyof typeof prefStr, propType: TProperty) => {
  console.log(propTypeStr[propType]);
  return `https://www.homes.co.jp/${propTypeStr[propType]}/${prefStr[pref]}/city`;
};

export const handlePrepareForm:
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
    await logErrorScreenshot(page, `Failed to navigate ${url} ${err.message}`);
    return false;
  }
};

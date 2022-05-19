import {Page} from 'puppeteer';
import {cityLists as location,
  dirPortalCheck,
  kintoneAppId} from '../../config';
import {prepareForm} from './citiesForm/prepareForm';
import {PropertyActions} from '../../types';
import {scrapeDtHouse} from './scrapeDtHouse';
import {logger, saveJSONToCSV} from '../../../../../utils';
import path from 'path';
import {scrapeDtMansion} from './scrapeDtMansion';
import {scrapeDtLot} from './scrapeDtLot';

// const homeURL = 'https://www.homes.co.jp/kodate/chuko/tokai/';
const submitSelector = '.prg-goToList:not(:disabled)';

const propertyActions: PropertyActions = [
  {
    type: '中古戸建',
    url: 'https://www.homes.co.jp/kodate/chuko/tokai/',
    handleScraper: scrapeDtHouse,
    submitSelector,
  },
  {
    type: '中古マンション',
    url: 'https://www.homes.co.jp/mansion/chuko/tokai/',
    handleScraper: scrapeDtMansion,
    submitSelector,
  },
  {
    type: '土地',
    url: 'https://www.homes.co.jp/tochi/tokai/',
    handleScraper: scrapeDtLot,
    submitSelector,
  },
];


export const scrapeHOMES = async (page: Page) => {
  for (const actions of propertyActions) {
    logger.info(`Processing ${actions.type}`);

    for (const [pref, cities] of Object.entries(location)) {
      console.log(cities);
      await page.goto(actions.url, {waitUntil: 'networkidle2'});
      await Promise.all([
        page.$x(`//a[contains(text(), "${pref}")]`)
          .then(([prefEl]) => prefEl.click()),
        page.waitForNavigation(),
      ]);

      await prepareForm(page, cities);

      await page.waitForSelector(actions.submitSelector);

      await Promise.all([
        page.click(actions.submitSelector),
        page.waitForNavigation({waitUntil: 'networkidle2'}),
      ]);

      const result = await actions.handleScraper(page);

      await saveJSONToCSV(
        path.join(
          dirPortalCheck,
          'data',
          `${kintoneAppId}-${actions.type}-${pref}.csv'`),
        result,
      );
    }
  }
};

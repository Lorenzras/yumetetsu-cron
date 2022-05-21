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

import {scrapeContacts} from './scrapeContact/scrapeContacts';


const propertyActions: PropertyActions = [
  {
    type: '中古戸建',
    url: 'https://www.homes.co.jp/kodate/chuko/tokai/',
    handleScraper: scrapeDtHouse,
  },
  {
    type: '中古マンション',
    url: 'https://www.homes.co.jp/mansion/chuko/tokai/',
    handleScraper: scrapeDtMansion,
  },
  {
    type: '土地',
    url: 'https://www.homes.co.jp/tochi/tokai/',
    handleScraper: scrapeDtLot,
  },
];


export const scrapeHOMES = async (page: Page) => {
  for (const actions of propertyActions) {
    logger.info(`Processing ${actions.type}`);

    for (const [pref, cities] of Object.entries(location)) {
      await page.goto(actions.url, {waitUntil: 'networkidle2'});
      await Promise.all([
        page.$x(`//a[contains(text(), "${pref}")]`)
          .then(([prefEl]) => prefEl.click()),
        page.waitForNavigation(),
      ]);

      await prepareForm(page, cities);

      const result = await scrapeContacts(
        page,
        await actions.handleScraper(page),
      );

      await saveJSONToCSV(
        path.join(
          dirPortalCheck,
          'data',
          `${kintoneAppId}-${actions.type}-${pref}.csv`),
        result,
      );
    }
  }
};

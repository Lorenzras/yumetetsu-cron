import {Page} from 'puppeteer';
import {cityLists as location, dirPortalCheck} from '../../config';
import {prepareForm} from './citiesForm/prepareForm';
import {PropertyActions} from '../../types';
import {scrapeDtHouse} from './scrapeDtHouse';
import {logger, saveJSONToCSV} from '../../../../../utils';
import path from 'path';

// const homeURL = 'https://www.homes.co.jp/kodate/chuko/tokai/';

const propertyActions: PropertyActions = [
  {
    type: '中古戸建',
    url: 'https://www.homes.co.jp/kodate/chuko/tokai/',
    handleScraper: scrapeDtHouse,
    submitSelector: '.prg-goToList:not(:disabled)',
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
        path.join(dirPortalCheck, 'data', pref + '.csv'),
        result,
      );
    }
  }
};

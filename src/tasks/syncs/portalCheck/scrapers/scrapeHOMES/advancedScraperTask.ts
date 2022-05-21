import {logger} from './../../../../../utils/logger';
import {IPropertyAction} from './../../types';
import {
  cityLists,
} from './../../config';
import {Page} from 'puppeteer';
import {prepareForm} from './citiesForm/prepareForm';


export const advancedScraperTask = async ({page, data}: {
  page: Page,
  data: IPropertyAction
}) => {
  for (const [pref, cities] of Object.entries(cityLists)) {
    logger.info('Navigating to pref: ' + pref);
    await page.goto(data.url, {waitUntil: 'domcontentloaded'});

    await Promise.all([
      page.waitForNavigation(),
      page.$x(`//a[contains(text(), "${pref}")]`)
        .then(([prefEl]) => prefEl.click()),

    ]);

    await prepareForm(page, cities);
    logger.info(`Form is ready for ${data.type}`);


    return await data.handleScraper(page);
  }

  return [];
};

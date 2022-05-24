import {logger} from '../../../../../utils/logger';
import {Page} from 'puppeteer';
import {prepareForm} from './citiesForm/prepareForm';
import {IClusterTaskData} from './clusterScraper';


export const clusterTask = async ({page, data}: {
  page: Page,
  data: IClusterTaskData
}) => {
  logger.info('Navigating to pref: ' + data.pref);
  await page.goto(data.url, {waitUntil: 'domcontentloaded'});

  await Promise.all([
    page.waitForNavigation(),
    page.$x(`//a[contains(text(), "${data.pref}")]`)
      .then(([prefEl]) => prefEl.click()),

  ]);

  await prepareForm(page, data.cities);
  logger.info(`Form is ready for ${data.type}`);


  return await data.handleScraper(page);
};

import {logger} from './../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {selectTargetCities} from './selectTargetCities';

const submitSelector = '.prg-goToList:not(:disabled)';

export const changePublishedRange = async (page: Page) => {
  const getTotalNum = async () => await page
    .$eval('.totalNum', (el) => $(el).eq(0).text())
    .catch(()=> {
      logger.error(`Failed to find .totalnum at ${page.url()}`);
      return 'error';
    });


  await Promise.all([

    page.waitForSelector(
      '#prg-loadingIcon', {visible: true, timeout: 2000})
      .catch(()=>logger.error('Loading icon did not appear.')),
    page.select('#cond_newdate', '3'),
    page.waitForResponse((r) => r.url() === 'https://t.karte.io/track' && r.status() === 200),
  ]);


  logger.info(`Waiting for loading icon to hide. ${await getTotalNum()}件`);
  await page.waitForSelector('#prg-loadingIcon', {hidden: true});
  await page.waitForSelector('.homes-ui-notifier-totalhits', {hidden: true});
};

export const prepareForm = async (
  page: Page,
  cities: string[],
) => {
  /* ステップ１ */
  await selectTargetCities(page, cities);

  logger.info('Looking for submit.');
  await page.waitForSelector(submitSelector);


  await Promise.all([
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
    page.click(submitSelector),
  ]);


  logger.info('Changing Publish range.');
  await changePublishedRange(page);
};

import {logger} from './../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {selectTargetCities} from './selectTargetCities';

const submitSelector = '.prg-goToList:not(:disabled)';

export const changePublishedRange = async (page: Page) => {
  await Promise.all([
    // page.waitForResponse((r) => r.url() === 'https://www.homes.co.jp/_ajax/kksearch/' && r.status() === 200),
    page.waitForSelector('#prg-loadingIcon', {visible: true}),
    page.select('#cond_newdate', '3'),
  ]);

  return page.waitForSelector('#prg-loadingIcon', {hidden: true});
};

export const prepareForm = async (
  page: Page,
  cities: string[],
) => {
  /* ステップ１ */
  await selectTargetCities(page, cities);


  await page.waitForSelector(submitSelector);

  await Promise.all([
    page.click(submitSelector),
    page.waitForNavigation({waitUntil: 'networkidle2'}),
  ]);

  await changePublishedRange(page);
};

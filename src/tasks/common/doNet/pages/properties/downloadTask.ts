import {navigateToPropertyPage} from './../navigate';
import {logger} from '../../../../../utils/logger';
import {IConcurrentData} from './types';
import {Page} from 'puppeteer';
import {login} from '../../login';
import {selectors} from './selectors';
import {handleDownload} from '../../helpers/handleDownload';
import {appIdProperty, dlPathDonetProperty, dlReqProperty} from './config';

export interface IPropForm {
  store: string,
  agents: string[]
  count: number
}

export const prepareForm = async (
  page: Page,
  {
    store, agent,
  }: IConcurrentData,
) => {
  // Store select
  await page.waitForSelector(`${selectors.storeSelect} option`);
  await page.select(selectors.storeSelect, store);

  // Agent select
  if (typeof agent === 'string') {
    await page.waitForSelector(`${selectors.agentsSelect} option`);
    await page.select(selectors.agentsSelect, agent);
  }

  // Press search
  await Promise.all([
    page.waitForNavigation(),
    page.click(selectors.searchButton),
  ]);
};

export const downloadTask = async (
  {page, data: formSetting} :
  {page: Page, data: IConcurrentData},
) => {
  logger.info('Starting download with options. ' +
    JSON.stringify(formSetting));

  await login(page);

  await navigateToPropertyPage(page);

  await prepareForm(page, formSetting);

  const resultCount = await page.$eval(
    '#kensakukekka .big',
    (el) => +$(el).text(),
  ).catch(()=>0);

  if (resultCount > 0 && resultCount <= 4000) {
    logger.info('Starting download store: ' + formSetting.store);
    await handleDownload({
      page,
      appId: appIdProperty,
      downloadDir: dlPathDonetProperty,
      requestURL: dlReqProperty,
    });
    logger.info('Finished download store: ' + formSetting.store);
  }


  return {
    store: formSetting.store,
    agents: [''],
    count: resultCount,

  } as IPropForm;
};

import {navigateToPropertyPage} from './../navigate';
import {logger} from '../../../../../utils/logger';
import {IConcurrentData} from './types';
import {Page} from 'puppeteer';
import {login} from '../../login';
import {prepareForm} from './prepareForm';
import {handleDownload} from '../../helpers/handleDownload';
import {appIdProperty, dlPathDonetProperty, dlReqProperty} from './config';

export interface IPropForm {
  store: string,
  agents: string[]
  count: number
}


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

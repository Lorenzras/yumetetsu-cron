import {blockImages} from './../../../browser/openBrowser';
import {getAgents} from './form/getAgents';
import {navigateToPropertyPage} from './../navigate';
import {logger} from '../../../../../utils/logger';
import {IConcurrentData} from './types';
import {Page} from 'puppeteer';
import {login} from '../../login';
import {prepareForm} from './form/prepareForm';
import {handleDownload} from '../../helpers/handleDownload';
import {appIdProperty, dlPathDonetProperty, dlReqProperty} from './config';


export interface IPropForm {
  store: string,
  agents?: string[]
  count?: number,
  stores: string[]
}


export const downloadTask = async (
  {page, data: formSetting} :
  {page: Page, data: IConcurrentData},
) => {
  logger.info('Starting download.');
  await blockImages(page);

  const stringifiedSettings = JSON.stringify(formSetting);
  await login(page);

  await navigateToPropertyPage(page);

  const {agents, stores} = await prepareForm(page, formSetting);


  const resultCount = await page.$eval(
    '#kensakukekka .big',
    (el) => +$(el).text(),
  ).catch(()=> 0);

  logger.info(
    `Trying to download ${resultCount} ${stringifiedSettings}`,
  );

  if (resultCount > 0 && resultCount <= 4000) {
    await handleDownload({
      page,
      appId: appIdProperty,
      downloadDir: dlPathDonetProperty,
      requestURL: dlReqProperty,
    });
    logger.info('Finished download store: ' + formSetting.store);
  }

  // clean up
  page.removeAllListeners();

  return {
    store: formSetting.store,
    agents: agents,
    count: resultCount,
    stores: stores,
  } as IPropForm;
};



import {Browser, Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {downloadLimit} from '../../config';
import {getOptionsStore} from './content';
import {clickSearch} from './clickSearch';
import {handleDownload} from './handleDownload';
import {downloadPerAgent} from './downloadPerAgent';
import selectors from './selectors';

import {navigateToCustPage} from '../navigate';
import {login} from '../../login';
import {setCustForm} from './setCustForm';

export const selectStoreThenSearch = async (page: Page, store: string) => {
  /* Select store */
  await page.waitForSelector(selectors.ddStores);
  await page.select(selectors.ddStores, store);

  return await clickSearch(page);
};

export const downloadStore = async (browser: Browser, store: string) => {
  /*
    Donetwork is limiting automation via the instance of the browser.
    I could have cleared cookies and other credentials but
    reinstating a new browser seem to be quicker solution.
     */
  const context = await browser.createIncognitoBrowserContext();
  const newPage = await context.newPage();

  /* Unconfirmed but network activity seems to be shared among
  opened browsers. Will convert this to child process if need arises.
   */
  newPage.setDefaultNavigationTimeout(0);

  await login(newPage);
  await navigateToCustPage(newPage);
  await setCustForm(newPage);

  /* Select store */
  /*  await newPage.waitForSelector(selectors.ddStores);
  await newPage.select(selectors.ddStores, store);
*/
  const resultCount = await selectStoreThenSearch(newPage, store);

  if (resultCount > 0 ) {
    if (resultCount <= downloadLimit) {
      await handleDownload(newPage);
    } else {
      await downloadPerAgent(newPage);
    }
  }

  await newPage.close();
};


export const downloadPerStore = async (
  page: Page,
) => {
  logger.info(`Started downloading per store`);
  const stores = await getOptionsStore(page);

  const promises: Promise<void>[] = [];

  for (const store of stores) {
    logger.info(`Selected store - ${store.text} `);
    promises.push(downloadStore(page.browser(), store.value));
  }

  await Promise.all(promises);
  return page;
};


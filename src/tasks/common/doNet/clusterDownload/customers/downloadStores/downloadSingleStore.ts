import {Page} from 'puppeteer';
import {logger} from '../../../../../../utils/logger';
import {login} from '../../../login';
import {selectStoreThenSearch} from '../../../pages/customer/downloadPerStore';
import {navigateToCustPage} from '../../../pages/navigate';

export const downloadSingleStore = async (
  page: Page,
  store: string,
) => {
  try {
    await login(page);
    // await navigateToCustPage(page);


    const result = 0; // await selectStoreThenSearch(page, store);
    if (result <= 4000) {
      logger.info(`Starting to download ${store}`);
    }

    return {
      isDone: result <= 4000,
      total: result,
    };
  } catch (err: any) {
    logger.error(`Error: ${store} ${err.message}`);
    return {
      isDone: true,
      result: 0,
    };
  }
};

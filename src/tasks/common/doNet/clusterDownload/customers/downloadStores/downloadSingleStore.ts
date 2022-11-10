import {clickSearch} from './../../../pages/customer/clickSearch';
import {Page} from 'puppeteer';
import {logger} from '../../../../../../utils/logger';
import {login} from '../../../login';
import {selectStoreThenSearch} from '../../../pages/customer/downloadPerStore';
import {setCustomerForm} from '../../../pages/customer/setCustomerForm';
import {navigateToCustPage} from '../../../pages/navigate';
import {dlLimit} from '../config';

export const downloadSingleStore = async (
  page: Page,
  storeId: string,
) => {
  try {
    await login(page);
    await navigateToCustPage(page);
    await setCustomerForm(page, {
      storeId,
    });

    const result = await clickSearch(page);

    if (result <= dlLimit) {
      logger.info(`Starting to download ${storeId}`);
      // Download here
    }

    return {
      isDone: result <= dlLimit,
      total: result,
      store: storeId,
    };
  } catch (err: any) {
    logger.error(`Error: ${storeId} ${err.message}`);
    return {
      isDone: true,
      result: 0,
      store: '',
    };
  }
};

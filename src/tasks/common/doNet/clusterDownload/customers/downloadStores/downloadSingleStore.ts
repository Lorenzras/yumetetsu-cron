import {clickSearch} from './../../../pages/customer/clickSearch';
import {Page} from 'puppeteer';
import {logger} from '../../../../../../utils/logger';
import {login} from '../../../login';
import {selectStoreThenSearch} from '../../../pages/customer/downloadPerStore';
import {setCustomerForm} from '../../../pages/customer/setCustomerForm';
import {navigateToCustPage} from '../../../pages/navigate';

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

    if (result <= 4000) {
      logger.info(`Starting to download ${storeId}`);
      // Download here
    }

    return {
      isDone: result <= 4000,
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

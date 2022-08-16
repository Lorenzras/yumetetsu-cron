import {Page} from 'puppeteer';
import {logger} from '../../../../../utils/logger';
import {login} from '../../login';
import {clickSearch} from '../../pages/customer/clickSearch';
import {
  setCustomerForm,
} from '../../pages/customer/setCustomerForm';
import {navigateToCustPage} from '../../pages/navigate';

export const downloadProcess = async (
  page: Page,
  options: IFormOptions,
) => {
  logger.info(options.storeId);
  await login(page);
  await navigateToCustPage(page);
  await setCustomerForm(page, options);

  const count = await clickSearch(page);

  return {
    count,
    options,
  };
};

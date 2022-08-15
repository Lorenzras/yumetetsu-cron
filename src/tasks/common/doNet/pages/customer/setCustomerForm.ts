import {selectors} from './selectors';
import {Page} from 'puppeteer';

/**
 * Wrapper for setting customer form.
 * @param page
 * @param options
 */
export const setCustomerForm = async (
  page: Page,
  options: {
    /** 店舗名 */
    storeId: string,
    /** ステータス(状態) */
    status?: TCustStatus[]
  },
) => {
  const {storeId} = options;
  /* Select store */
  await page.waitForSelector(selectors.ddStores);
  await page.select(selectors.ddStores, storeId);
};

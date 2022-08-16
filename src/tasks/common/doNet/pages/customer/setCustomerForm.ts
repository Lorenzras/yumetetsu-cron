import {selectors} from './selectors';
import {Page} from 'puppeteer';


/**
 * Wrapper for setting customer form.
 * @param page
 * @param options
 */
export const setCustomerForm = async (
  page: Page,
  options: IFormOptions,
) => {
  const {
    storeId,
    agentId,
    status = [],
  } = options;

  /* Select store */
  await page.waitForSelector(selectors.ddStores);
  await page.select(selectors.ddStores, storeId);


  /* Select agent */
  if (agentId) {
    // wait until there are multiple options
    await page.waitForSelector(selectors.ddAgents + ' > option + option');
    await page.select(selectors.ddAgents, agentId);
  }


  /* Set status */
  await page.evaluate((status: TCustStatus[])=>{
    const elStatuses = $('th:contains(状態) ~ td div div');
    elStatuses.each((_, statusDiv) => {
      const opt = $(statusDiv).text().trim() as TCustStatus;
      const isChecked = status.includes(opt);
      console.log(opt, isChecked);
      $(statusDiv).find('input').prop('checked', isChecked);
    });
  }, status);
};

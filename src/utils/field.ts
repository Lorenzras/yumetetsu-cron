import {Page} from 'puppeteer';

/**
 * Clears field.
 *
 * @param page
 * @param selector
 * @deprecated changed name to clearField
 */
export async function clear(page: Page, selector: string): Promise<any> {
  return await page.evaluate((selector) => {
    document.querySelector(selector).value = '';
  }, selector);
}


/**
 * Clears field.
 *
 * @param page
 * @param selector
 */
export const clearField = async (page: Page, selector: string) => {
  return await page.evaluate((selector) => {
    document.querySelector(selector).value = '';
  }, selector);
};

export const setFieldValue = async (
  {page, selector, newValue}:
  {page: Page, selector: string, newValue: string}) => {
  await page.waitForSelector(selector);
  await page.evaluate((selector, value)=>{
    const field = document
      .querySelector(selector) as HTMLInputElement;
    if (field) {
      field.value = value;
    }
  }, selector, newValue);
};


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
export async function clearField(page: Page, selector: string) {
  return await page.evaluate((selector) => {
    document.querySelector(selector).value = '';
  }, selector);
}


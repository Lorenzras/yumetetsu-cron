import {Page} from 'puppeteer';

/**
 * Clears field.
 *
 * @param page
 * @param selector
 */
export async function clear(page: Page, selector: string): Promise<any> {
  return await page.evaluate((selector) => {
    document.querySelector(selector).value = '';
  }, selector);
}

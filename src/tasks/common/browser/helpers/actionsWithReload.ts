import {Page} from 'puppeteer';

export const clickWithReload = async (page: Page, selector: string) => {
  return Promise.all([
    page.waitForNavigation(),
    page.click(selector),
  ]);
};

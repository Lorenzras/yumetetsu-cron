import {Page} from 'puppeteer';

export const clickWithReload = async (page: Page, selector: string) => {
  return Promise.all([
    page.waitForNavigation({waitUntil: 'networkidle2'}),
    page.click(selector),
  ]);
};

import {Page} from 'puppeteer';
import {selectors} from './../selectors';

export const getAgents = async ({page}: {page: Page}) => {
  await page.waitForSelector(`${selectors.agentsSelect} option`);
  return page.$$eval(
    `${selectors.agentsSelect} option`,
    (els) => els
      .map((el) => $(el).attr('value'))
      .filter(Boolean),
  );
};

import {Page, ElementHandle} from 'puppeteer';
import {selectors} from './selectors';
import {scrollToEl} from '../../../browser/helpers/scrollToEl';

import {logger} from '../../../../../utils';
import {getResultCount} from './content';

export const clickSearch = async (page: Page) => {
  await page.waitForSelector(selectors.btnSearch, {visible: true});
  logger.info(`Found the search button `);

  await scrollToEl(
    page, (await page.$(selectors.btnSearch) as ElementHandle),
  );

  await Promise.all([
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
    page.click(selectors.btnSearch),
  ]);


  logger.info(`Clicked search button `);

  await Promise.race([
    page.waitForSelector(
      selectors.resultCount, {timeout: 8000, visible: true}),
    page.waitForSelector(
      selectors.resultNothing, {timeout: 8000, visible: true}),
  ]);

  const count = await getResultCount(page);


  return count;
};

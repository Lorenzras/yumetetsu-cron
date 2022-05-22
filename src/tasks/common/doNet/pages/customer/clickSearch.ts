import {Page, ElementHandle} from 'puppeteer';
import selectors from './selectors';
import {scrollToEl} from '../../../browser/helpers/scrollToEl';
import {
  clickWithReload,
} from '../../../browser/helpers/actionsWithReload';
import {logger} from '../../../../../utils';
import {getResultCount} from './content';

export const clickSearch = async (page: Page) => {
  await page.waitForSelector(selectors.btnSearch, {visible: true});
  logger.info(`Found the search button `);

  await scrollToEl(
    page, (await page.$(selectors.btnSearch) as ElementHandle));

  await clickWithReload(page, selectors.btnSearch);
  logger.info(`Clicked search button `);

  await Promise.race([
    page.waitForSelector(
      selectors.resultCount, {timeout: 4000, visible: true}).catch(),
    page.waitForSelector(
      selectors.resultNothing, {timeout: 4000, visible: true}).catch(),
  ]);

  const count = getResultCount(page);


  return count;
};

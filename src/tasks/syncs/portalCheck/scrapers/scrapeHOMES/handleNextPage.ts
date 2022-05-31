import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';

export const handleNextPage = async (page: Page) => {
  const nextPageBtn = await page.$('.nextPage');
  if (nextPageBtn) {
    logger.info(`Clicking nextPage ${page.url()}`);
    await Promise.all([
      page.waitForNavigation(),
      page.evaluate(()=>{
        $('.nextPage a')[0].click(); // force click next
      }),
    ]);
    logger.info('Succesfully clicked next page.');
    return true;
  }
  return false;
};

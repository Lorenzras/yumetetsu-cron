import {Page} from 'puppeteer';
import {logger} from '../../../../utils';
import {homeSelectors} from '../config';


/* Must be on homepage after loging in. */
/* export default async (page: Page) => {
  await page.waitForSelector(selectors.loggedInEl);
  await page.click(selectors.custNav);
  return page;
}; */

export const navigateToCustPage = async (page: Page) => {
  logger.info('Navigating to customer page.');


  await page.waitForSelector(homeSelectors.custNav),
  await page.click(homeSelectors.custNav);
  await page.waitForNetworkIdle();

  return page;
};


export const navigateToPropertyPage = async (page: Page) => {
  logger.info('Navigating to property page.');

  await page.waitForSelector(homeSelectors.propNav,
    {
      visible: true,
      timeout: 60000,
    }),
  await Promise.all([
    page.waitForNavigation(),
    page.click(homeSelectors.propNav),

  ]);


  return page;
};

import {Page} from 'puppeteer';
import {logger, sleep} from '../../../../utils';
import {homeSelectors} from '../config';
import {login} from '../login';
import {selectors} from './customer';


/* Must be on homepage after loging in. */
/* export default async (page: Page) => {
  await page.waitForSelector(selectors.loggedInEl);
  await page.click(selectors.custNav);
  return page;
}; */

export const navigateToCustPage = async (page: Page) => {
  logger.info('Navigating to customer page.');

  await Promise.all([
    page.waitForNavigation(),
    page.click(selectors.custNav),
  ]);

  // Donetwork started throttling direct access to links. 2022.11.09 ~ ras
  /*  await page.goto('https://manage.do-network.com/customer',
    {
      waitUntil: 'domcontentloaded',
      timeout: 1000 * 60 * 5,
    }); */

  const isSuccess = await Promise.race([
    page.waitForSelector('table.error_navi').then(()=>false),
    page.waitForSelector(homeSelectors.custNav, {timeout: 1000 * 60 * 2})
      .then(()=>true),
  ]);

  if (!isSuccess) throw new Error('Failed to navigate to customer page.');

  console.log('Customer page has been loaded.');

  return page;
};


export const navigateToPropertyPage = async (page: Page) => {
  logger.info('Navigating to property page.');

  await page.waitForSelector(homeSelectors.propNav,
    {
      visible: true,
    }),
  await Promise.all([
    page.waitForNavigation(),
    page.click(homeSelectors.propNav),

  ]);


  return page;
};

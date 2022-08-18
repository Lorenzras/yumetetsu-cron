import {Page} from 'puppeteer';
import {logger} from '../../../../utils';
import {homeSelectors} from '../config';
import {login} from '../login';


/* Must be on homepage after loging in. */
/* export default async (page: Page) => {
  await page.waitForSelector(selectors.loggedInEl);
  await page.click(selectors.custNav);
  return page;
}; */

export const navigateToCustPage = async (page: Page) => {
  logger.info('Navigating to customer page.');
  await page.goto('https://manage.do-network.com/customer', {waitUntil: 'domcontentloaded'});

  const isSuccess = await Promise.race([
    page.waitForSelector('table.error_navi').then(()=>false),
    page.waitForSelector(homeSelectors.custNav).then(()=>true),
  ]);

  return isSuccess;
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

import {Page} from 'puppeteer';
import {logger, sleep} from '../../../../utils';
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

  console.log('Dom content has been loaded.');

  const isSuccess = await Promise.race([
    page.waitForSelector('table.error_navi').then(()=>false),
    page.waitForSelector(homeSelectors.custNav).then(()=>true),
  ]);


  await sleep(1000 * 60 * 60 *60);

  if (!isSuccess) throw new Error('Failed to navigate to customer page.');

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

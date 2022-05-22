import {Page} from 'puppeteer';
import {login} from '../../../login';
import {navigateToPropertyPage} from '../../navigate';
import {selectors} from './../selectors';

export const getStores = async ({
  page,
  seperateStance = false,
}:{
  page: Page
  seperateStance?: boolean
}) => {
  if (seperateStance) {
    await login(page);
    await navigateToPropertyPage(page);
  }


  await page.waitForSelector(`${selectors.storeSelect} option`);
  const stores = await page.$$eval(
    `${selectors.storeSelect} option`,
    (els) => els
      .map((el) => $(el).attr('value'))
      .filter(Boolean),
  );


  return stores;
};

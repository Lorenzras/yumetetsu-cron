import {Page} from 'puppeteer';
import {logger} from '../../../utils/logger';

import {URLs, selectors} from './config';

export const login = async (page: Page ) => {
  logger.info('Started login to doNetwork. ');

  await page.goto(URLs['login'], {waitUntil: 'networkidle2'});
  await page.waitForNetworkIdle();
  await page.waitForSelector(selectors.user);
  await page.select(selectors.store, '157');
  await page.type(selectors.user, process.env.DO_NETWORK_USER);
  await page.type(selectors.pass, process.env.DO_NETWORK_PASSWORD);
  await page.click(selectors.login);

  return page;
};

import {Page} from 'puppeteer';
import {clearField} from '../../../utils';
import {logger} from '../../../utils/logger';

import {URLs, selectors} from './config';

export const login = async (page: Page ) => {
  logger.info('Started login to doNetwork. ');

  await page.goto(URLs['login'], {waitUntil: 'networkidle2'});
  await page.waitForNetworkIdle();
  await page.waitForSelector(selectors.user);
  await page.select(selectors.store, '157');

  await clearField(page, selectors.user);
  await page.type(selectors.user, process.env.DO_NETWORK_USER);

  await clearField(page, selectors.pass);
  await page.type(selectors.pass, process.env.DO_NETWORK_PASSWORD);
  await Promise.all([
    page.waitForNavigation(),
    page.click(selectors.login),
  ]);
};

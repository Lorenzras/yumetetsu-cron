import {Page} from 'puppeteer';
import {logger} from '../../../utils';
import {clear} from '../../../utils/field';


const selectors = {
  user: '[name="username"]',
  pass: '[name="password"]',
  btnLogin: '.login-button',
};

export const login = async (page: Page) => {
  const username = process.env.KINTONE_USER;
  const password = process.env.KINTONE_PASS;

  if (!username || !password) {
    logger.error('Please set environment\'s username and password.');
    return;
  }

  await page.waitForSelector(selectors.btnLogin);

  /*  logger.info('Navigating to kintone login.');
  await page.goto(url); */

  logger.info('Trying to login to kintone.');
  await clear(page, selectors.user);
  await page.type(selectors.user, username);

  await clear(page, selectors.pass);
  await page.type(selectors.pass, password);

  logger.info('Pressing enter to confirm login.');
  await page.keyboard.type('\n');
};

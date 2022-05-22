import {setFieldValue} from './../../../utils/field';
import {Page} from 'puppeteer';
import {logger} from '../../../utils';


export const selectors = {
  user: '[name="username"]',
  pass: '[name="password"]',
  btnLogin: '.login-button',
};

export const login = async (page: Page) => {
  const username = process.env.KINTONE_USER;
  const password = process.env.KINTONE_PASS;

  if (!username || !password) {
    logger.error('Please set environment\'s username and password.');
    throw new Error('Failed to login kintone.');
  }

  await page.waitForSelector(selectors.btnLogin);

  /*  logger.info('Navigating to kintone login.');
  await page.goto(url); */

  logger.info('Trying to login to kintone.');

  // await clearField(page, selectors.user);
  await setFieldValue({
    page,
    selector: selectors.user,
    newValue: username,
  });

  // await clearField(page, selectors.pass);
  await setFieldValue({
    page,
    selector: selectors.pass,
    newValue: password,
  });
  // await page.type(selectors.pass, password);

  logger.info('Pressing enter to confirm login.');
  await page.click(selectors.btnLogin);
};

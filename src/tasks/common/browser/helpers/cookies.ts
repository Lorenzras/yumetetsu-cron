import path from 'path';
import {logger} from '../../../../utils/logger';
import {cookiesPath} from '../../../../utils/paths';
import fs from 'fs/promises';
import {Page} from 'puppeteer';

export const cookieFilePath = (workerId: number) => {
  return path.join(cookiesPath, `donet-${workerId}.json`);
};

export const saveBrowserCookie = async (page: Page, workerId: number) => {
  logger.info(`Worker ${workerId} is saving cookie.`);
  try {
    const workerCookie = await page.cookies();
    const cookiePath = cookieFilePath(workerId);
    await fs.writeFile(cookiePath, JSON.stringify(workerCookie));
    logger.info(`Worker ${workerId} successfully saved cookie.`);
  } catch (err: any) {
    logger.error(`I was not able to save the cookie. ${err.message}`);
  }
};

export const setBrowserCookie = async (page: Page, workerId: number) => {
  logger.info(`Worker ${workerId} is setting cookie to page.`);

  try {
    const cookiePath = cookieFilePath(workerId);
    const cookiesString = await fs.readFile(cookiePath, 'utf8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    logger.info(`Worker ${workerId} is successfully set cookie.`);
    return true;
  } catch (err) {
    logger.warn('I was not able to load the cookie.');
    return false;
  }
};

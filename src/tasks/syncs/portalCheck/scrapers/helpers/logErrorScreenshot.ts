
import {Page} from 'puppeteer';
import {getFileName, logger} from '../../../../../utils';
import {dlImg, kintoneAppId} from '../../config';

export const logErrorScreenshot = async (page: Page, message: string) => {
  logger.error(message);
  await page.screenshot({
    path: getFileName({
      appId: kintoneAppId,
      dir: dlImg,
      ext: 'png',
    }),
  });
};

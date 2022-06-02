
import path from 'path';
import {Page} from 'puppeteer';
import {getFileName, logger, saveFile} from '../../../../../utils';
import {dlImg} from '../../config';

/**
 * Saves the screenshot, message, and the page content.
 * Directory may be set at portalCheck/config/dlImage
 *
 * @param page
 * @param message
 */
export const logErrorScreenshot = async (page: Page, message: string) => {
  const fileName = getFileName({
    dir: dlImg,
  });
  logger.error(`${message} ${path.basename(fileName)}` );
  const body = await page.content();

  await saveFile(fileName + '.html', body);

  await page.screenshot({
    path: fileName + '.png',
  });
};

import {logsDatedPath} from './../../../../utils/logger';

import path from 'path';
import {Page} from 'puppeteer';
import {getFileName, logger, logsPath, saveFile} from '../../../../utils';
import {format} from 'date-fns';


export const saveHTML = async (
  html: string,
  filePath = getFileName({
    dir: path.join(logsPath, format(new Date(), 'yyyy.MM.dd')),
  })) => {
  await saveFile(filePath + '.html', html);
};

/**
 * Saves the screenshot, message, and the page content.
 * Directory may be set at portalCheck/config/dlImage
 *
 * @param page
 * @param message
 */
export const logErrorScreenshot = async (page: Page, message: string) => {
  const filePath = getFileName({
    dir: path.join(logsPath, format(new Date(), 'yyyy.MM.dd')),
  });
  const fileName = path.basename(filePath);

  try {
    logger.error(`${message} ${fileName}` );
    if (page.isClosed()) return;

    await page.screenshot({
      path: filePath + '.png',
    });
    const body = await page.content();
    await saveHTML(body, filePath);
  } catch (err: any) {
    logger.error(`Failed to save screenshot. ${fileName} ${err.message}` );
  }
};

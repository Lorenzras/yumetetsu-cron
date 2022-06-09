import {logsDatedPath} from './../../../../utils/logger';

import path from 'path';
import {Page} from 'puppeteer';
import {getFileName, logger, saveFile} from '../../../../utils';


/**
 * Saves the screenshot, message, and the page content.
 * Directory may be set at portalCheck/config/dlImage
 *
 * @param page
 * @param message
 */
export const logErrorScreenshot = async (page: Page, message: string) => {
  const filePath = getFileName({
    dir: logsDatedPath,
  });
  const fileName = path.basename(filePath);

  try {
    await page.screenshot({
      path: filePath + '.png',
    });
    
    logger.error(`${message} ${fileName}` );
    const body = await page.content();

    await saveFile(filePath + '.html', body);


  } catch (err: any) {
    logger.error(`Failed to save screenshot. ${fileName} ${err.message}` );
  }
};

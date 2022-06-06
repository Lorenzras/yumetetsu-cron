
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
  const filePath = getFileName({
    dir: dlImg,
  });
  const fileName = path.basename(filePath);

  try {
    logger.error(`${message} ${fileName}` );
    const body = await page.content();

    await saveFile(filePath + '.html', body);

    await page.screenshot({
      path: filePath + '.png',
    });
  } catch (err: any) {
    logger.error(`Failed to save screenshot. ${fileName}`);
  }
};

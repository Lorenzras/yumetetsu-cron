import {blockImages} from '../../../common/browser';
import {uploadSingleCSVSmart} from '../../../common/kintone/uploadCSV';
import {Page} from 'puppeteer';
import {deleteFile, logger} from '../../../../utils';
import path from 'path';

export const uploadTask = async (page: Page, file: string) => {
  await blockImages(page);
  await uploadSingleCSVSmart({
    page,
    fileWithAppId: file,
    keyField: '物件番号',
  });

  // Clean up
  page.removeAllListeners();
  await deleteFile(file);
  logger.info('Finished upload task for ' + path.basename(file));
};
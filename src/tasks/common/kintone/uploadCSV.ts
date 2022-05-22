import {archivePath, dumpPath, getCSVFiles, logger} from '../../../utils';
import {selectors as loginSels, login} from './login';
import {Page} from 'puppeteer';
import path from 'path';
import fs from 'fs';

const timeout = 600000;

export const selectors = {
  inputFile: 'input[type=file]',
  btnUploadFile: '#fileKey-browse',
  btnImport: '#import-uploadForm-gaia:not([disabled])',
  headerYes: '.input-radio-item-cybozu > input',
};


export const goToImportPage = async (page: Page, appId: string) => {
  const baseUrl = process.env.KINTONE_BASE_URL;
  const uploadUrl = `${baseUrl}/k/${appId}/importRecord`;

  logger.info(`Navigating to upload page for ${appId}`);

  await page.goto(uploadUrl);

  const btnLogin = (await page.$(loginSels.btnLogin)) || '';
  if (btnLogin) {
    await login(page);
  }

  await page.waitForSelector(
    '.button-submit-cybozu.button-disabled-cybozu',
    {timeout})
    .catch((err) => {
      throw new Error('Failed to navigate to import page. ' + err.message);
    });

  logger.info(`Successfully navigated to ${appId}`);
};

export const attachFile = async (page: Page, filePath: string) => {
  logger.info(`Attaching ${filePath}`);

  await page.waitForSelector(selectors.inputFile, {timeout});
  const inputUploadHandle = await page.$(selectors.inputFile);

  await inputUploadHandle?.uploadFile(filePath);

  logger.info(`Attempting to click yes.`);
  await page.waitForSelector(
    selectors.headerYes,
    {
      visible: true,
      timeout,
    },
  );

  await page.click(selectors.headerYes);
  logger.info(`Succesfully clicked yes.`);
};

export const handleUpload = async (
  page: Page, keyField: string,
) => {
  logger.info(`Toggling key ${keyField}`);
  await page.waitForNetworkIdle();
  await page.waitForSelector(`input[id^='${keyField}']`, {
    visible: true,
    timeout,
  });
  await page.click(`input[id^='${keyField}']`);

  logger.info(`Pressing import.`);
  await page.waitForSelector(selectors.btnImport, {timeout});
  await page.click(selectors.btnImport);
  logger.info(`Succesfully pressed import.`);
};

const moveFileToArchive = (filePath: string) => {
  const archiveFilePath = path.join(archivePath, path.basename(filePath));
  fs.rename(filePath, archiveFilePath, (err) => {
    if (err) {
      logger.error(`Failed to move file. ${archiveFilePath}`);
    } else {
      logger.info(`Successfully moved. ${archiveFilePath}`);
    }
  });
};

/**
 * Uploads a single csv.
 * @param page
 * @param appId
 * @param keyField
 * @param file full filepath
 */
export const uploadSingleCSV = async (
  page: Page, appId: string, keyField = 'レコード番号', file: string,
) => {
  await goToImportPage(page, appId);
  await attachFile(page, file);
  await handleUpload(page, keyField);
};


/**
 * Upload CSV to kintone based on the appId in the filename.
 *
 * Filename format : [appId]-***.csv
 */
export const uploadSingleCSVSmart = async (


  {page, keyField = 'レコード番号', fileWithAppId}
  : {
    page: Page,
    keyField?: string,
    fileWithAppId: string
  },
) => {
  try {
    const fileName = path.parse(fileWithAppId).base;
    const appId = fileName.split('-', 1)[0];
    if (isNaN(+appId)) {
      throw new Error(
        `${appId} is not a valid appId.`);
    }
    await goToImportPage(page, appId);
    await attachFile(page, fileWithAppId);
    await handleUpload(page, keyField);
  } catch (err : any) {
    logger.error(`Error uploading to kintone. ${err.message}`);
    throw new Error(err.message);
  }
};

/**
 * Uploads all processed csv.
 *
 * @param {Page} page
 * @param {string} appId
 * @param {string} [keyField='レコード番号']
 * @return {*} page
 */
export const uploadCSV = async (
  page: Page, appId: string, keyField = 'レコード番号',
) => {
  logger.info(`Starting upload to kintone for ${appId}.`);
  const files = getCSVFiles(dumpPath, appId);
  for (const file of files) {
    await uploadSingleCSV(page, appId, keyField, file);
    moveFileToArchive(file);
  }
};

import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';
import {KStoreSettings, storeSettings} from '../../../../config';
import {logger, saveJSONToCSV} from '../../../../utils';
import {parse} from 'fast-csv';
import {summarizeErrors} from './summarizaErrors';
import {sendFileToChatwork} from './sendFileToChatwork';
import {cleanStoreName} from './cleanStoreName';

/**
 * Remove empty columns
 *
 * @param csvString
 * @returns {json} json array
 */
export const cleanCSV = async (csvString: string) => {
  const rows: Record<string, string>[] = [];
  await new Promise((resolve, reject) => {
    const stream = parse({
      headers: true,
      ignoreEmpty: true,
      trim: true,
    })
      .on('error', (error) => console.error(error ))
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end',
        (rowCount: number) => console.log(`Parsed ${rowCount} rows.`));

    stream.write(csvString);
    stream.on('error', reject);
    stream.end(resolve);
  });

  // Remove empty columns
  const emptyColumns = rows.reduce((curr, prev) => {
    Object.keys(prev).forEach((k) => {
      if (!curr.includes(k) && !prev[k] ) {
        curr.push(k);
      }
    });
    return curr;
  }, [] as string[]);

  rows.forEach((r) => {
    emptyColumns.forEach((emp) => {
      delete r[emp];
    });
  });

  return rows;
};


/**
 * Main download process
 *
 * @param page
 * @param storeId
 */
export const downloadError = async (
  page: Page,
  storeId: KStoreSettings,
) => {
  await page.waitForSelector(
    'a[href*="upload-csv/download-uploaded-csv"]',
    {visible: true},
  );
  const result = await page.evaluate(()=>{
    const requestURL = $('a[href*="error"]:first').prop('href');
    if (!requestURL) return;
    return fetch(requestURL, {
      method: 'GET',
      credentials: 'include',
      headers: [['charset', 'ISO-8859-1']],
    })
      .then((res) => res.arrayBuffer())
      .then((buffer)=>{
        const decoder = new TextDecoder('shift-jis');

        const text = decoder
          .decode(buffer);

        return text;
      });
  });


  if (!result) {
    logger.info('No error found.');
    return;
  }

  const downloadDir = path.join(__dirname, 'resultDir');
  fs.existsSync(downloadDir) || fs.mkdirSync(downloadDir, {recursive: true});
  const storeName = cleanStoreName(storeSettings[storeId].name);
  const filePath = path
    .join(
      downloadDir,
      `${storeName}_エラー`,
    );

  logger.info(`Saving to ${filePath}`);

  const processedCSV = await cleanCSV(result);

  const csvFilePath = await saveJSONToCSV(filePath, processedCSV, 'utf8');

  const errorSummary = summarizeErrors(processedCSV);

  if (!csvFilePath) throw new Error('Failed to retrive filepath after saving.');
  await sendFileToChatwork({
    filePath: csvFilePath,
    fileDetails: errorSummary,
  });

  return errorSummary;
};

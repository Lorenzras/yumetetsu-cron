import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';
import {KStoreSettings} from '../../../../config';
import {logger, saveJSONToCSV} from '../../../../utils';
import {parse} from 'fast-csv';

/**
 * Remove empty columns
 *
 * @param csvString
 * @returns {json} json array
 */
export const cleanCSV = async (csvString: string) => {
  console.log(csvString);
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

  console.log(rows);

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
  const result = await page.evaluate(()=>{
    const requestURL = $('a[href*="error"]:first').prop('href');
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

  const downloadDir = path.join(__dirname, 'resultDir');

  fs.existsSync(downloadDir) || fs.mkdirSync(downloadDir, {recursive: true});

  const filePath = path
    .join(
      downloadDir,
      `${storeId}-error`,
    );

  logger.info(`Saving to ${filePath}`);

  const csvObject = await cleanCSV(result);

  await saveJSONToCSV(filePath, csvObject);

  /*  fs.writeFileSync(
    filePath,
    iconv.encode(result, 'shift-jis'),
  ); */
};

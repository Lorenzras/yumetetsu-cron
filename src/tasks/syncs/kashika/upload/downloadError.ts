import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';
import {KStoreSettings, TStoreSettingsItem} from '../../../../config';
import {logger} from '../../../../utils';
import iconv from 'iconv-lite';

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
      `${storeId}-error.csv`,
    );

  logger.info(`Saving to ${filePath}`);

  fs.writeFileSync(
    filePath,
    iconv.encode(result, 'shift-jis'),
  );

  console.log(result);
};

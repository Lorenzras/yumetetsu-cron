/* eslint-disable max-len */

import fsPromise, {readFile} from 'fs/promises';


import path from 'path';
import {
  downloadDir,
} from '../../../common/doNet/clusterDownload/customers/config';
import {parse} from '@fast-csv/parse';
import {KStoreSettings, storeSettings, TStoreSettingsItem} from '../../../../config';
import {sendResultToChatWork} from '../upload/sendResultToChatWork';

/**
 * Requirements
 * 1. Group by storeId
 * 2. Remove duplicate 反響媒体
 * 3.
 * @param dir
 * @returns {Object} records grouped by storeId
 */
export const processCSV = async (dir = downloadDir) => {
  const csvFiles = (await fsPromise.readdir(dir))
    .filter((file) => file.split('.').at(-1) === 'csv' );

  // Stores grouped record per store.
  const record: Record<string, Record<string, string>[]> = Object.create(null);

  /** Create the parse. Magic happens here including Filter. */
  for (const csvFile of csvFiles) {
    const csvString = await readFile(path.join(dir, csvFile), 'utf-8');
    // Get the store id is in the filename. Note: This should match format of the filename when saving.
    const storeId = csvFile.split('-')[1];
    const email = (storeSettings[storeId as KStoreSettings] as TStoreSettingsItem).email ?? '';

    // console.log(headers);
    await new Promise((resolve, reject) => {
      const stream = parse({
        headers: (headers) => {
          headers[headers.findIndex((e) => e === '反響媒体') + 1] = undefined;
          return headers;
        },
        ignoreEmpty: true,
      })
        .on('error', (error) => console.error(error, csvFile ))
        .on('data', (row) => {
          // Initialize record[storeId] if empty
          if (!record[storeId]) record[storeId] = [];

          if ([row['電話番号'], row['メールアドレス']].some(Boolean)) {
            record[storeId].push({
              ...row,
              店舗営業担当者: email,
              メール禁止フラグ: +Boolean(row['メール禁止フラグ']),
              タグ: `${row['店舗名']}_${row['顧客種別']}`,
            });
          }
        })
        .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows. ${csvFile}`));

      stream.write(csvString);
      stream.on('error', reject);
      stream.end(resolve);
    });
  }

  await sendResultToChatWork(record);

  return record;
};

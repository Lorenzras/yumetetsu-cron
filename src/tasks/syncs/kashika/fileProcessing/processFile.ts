/* eslint-disable max-len */
import {readFirstLine} from '../../../../utils/file';

import fsPromise, {readFile} from 'fs/promises';
import {createReadStream} from 'fs';
import {EOL} from 'os';

import path from 'path';
import iconv from 'iconv-lite';
import {
  downloadDir,
} from '../../../common/doNet/clusterDownload/customers/config';
import {parse} from '@fast-csv/parse';


export const processFile = async () => {
  const dir = downloadDir;
  const csvFiles = (await fsPromise.readdir(dir))
    .filter((file) => file.split('.').at(-1) === 'csv' );

  /** Retrieve headers  */
  const headers : Array<string | undefined> = (
    await readFirstLine(path.join(dir, csvFiles[0]))
  )
    .split(',');

  /*
  Ignore 2nd 反響媒体
  https://c2fo.github.io/fast-csv/docs/parsing/examples/#ignoring-empty-rows
   */
  headers[headers.findIndex((e) => e === '反響媒体') + 1] = undefined;

  /** Stores the record */
  const record: Record<string, string>[] = [];

  /** Create the parse. Magic happens here. */

  for (const csvFile of csvFiles) {
    const CSV_STRING = await readFile(path.join(dir, csvFile));
    await new Promise((resolve, reject) => {
      const stream = parse({
        headers: headers,
      })
        .on('error', (error) => console.error(error))
        .on('data', (row) => record.push({...row, タグ: 'success'}))
        .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

      stream.write(CSV_STRING);
      stream.on('error', reject);
      stream.end(resolve);
    });
  }


  return record;
};

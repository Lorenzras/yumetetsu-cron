import {downloadDir} from '../../common/doNet/clusterDownload/customers/config';
import fs from 'fs/promises';
import csv from 'csvtojson';
import path from 'path';
import iconv from 'iconv-lite';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const csvToJson = require('convert-csv-to-json');

export const combine = async () => {
  const dir = downloadDir;
  const files = await fs.readdir(dir);


  /*   const result = await csv()
    .fromFile(path.join(dir, '顧客一覧 (7).csv'), {encoding: 'Shift-JIS'}); */
  const data = await fs.readFile(path.join(dir, '顧客一覧 (7).csv'));
  const buf = Buffer.from(data);
  const retStr = iconv.decode(buf, 'Shift_JIS');

  await fs.writeFile(path.join(__dirname, 'test.csv'), retStr);

  await csvToJson.generateJsonFileFromCsv(
    path.join(__dirname, 'test.csv'),
    path.join(__dirname, 'test.json'));
};

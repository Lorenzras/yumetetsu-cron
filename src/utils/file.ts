import fs from 'fs';
import {logger} from './logger';
import path from 'path';
import {dumpPath} from './paths';
import iconv from 'iconv-lite';
import rmfr from 'rmfr';
import {json2csvAsync} from 'json-2-csv';
import {nanoid} from 'nanoid';
import format from 'date-fns/format';

export const getCSVFiles = (dir: string, appId: string) => {
  const result = fs.readdirSync(dir)
    .filter((file) => {
      return file.split('.')[1] === 'csv' && file.split('-')[0] === appId;
    }).map((fileName) => path.join(dumpPath, fileName));

  logger.info(`Found ${result.length} csv files`);
  return result;
};

/**
 * Save csv file
 *
 * @param filePath
 * @param data comma delimited csv. See conventions.
 */
export const saveCSV = (filePath: string, data: string) => {
  fs.writeFileSync(filePath, '');

  const fd = fs.openSync( filePath, 'w');
  const buff = iconv.encode(
    data.replace(/²/g, '2'),
    'Shift_JIS',
  );

  fs.writeSync( fd, buff);
  fs.close(fd);
};

export const saveJSONToCSV = async (
  filePath: string,
  json: {[k: string]: any}[],
) =>{
  saveCSV(filePath + '.csv', await json2csvAsync(json));
};

export const saveJSON = async (
  filePath: string,
  data: {[k: string]: any}[],
) => {
  fs.writeFileSync(filePath + '.json', JSON.stringify(data));
};

export const deleteFile = async (file: string) => {
  try {
    logger.info(`Deleting file ${path.basename(file)}`);
    await rmfr(file);
  } catch (err: any) {
    logger.error('Failed to delete file.');
    throw new Error('Failed to delete file ' + err.message);
  }
};

export const getFileName = (
  {
    dir = './',
    appId,
    suffix,
  }:
  {
    dir: string,
    appId?: string | number,
    suffix?: string,
    ext?: string
  }) => {
  const randomize = format(new Date(), `yyyyMMdd-HHmmss`) + `-${nanoid(5)}`;

  return path.join(
    dir,
    `${[appId, randomize, suffix]
      .filter(Boolean)
      .join('-')}`,
  );
};

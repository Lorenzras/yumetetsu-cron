import fs, {createReadStream} from 'fs';
import asyncFs from 'fs/promises';
import {logger} from './logger';
import path from 'path';
import {dumpPath} from './paths';
import iconv from 'iconv-lite';
import rmfr from 'rmfr';
import {json2csvAsync} from 'json-2-csv';
import {nanoid} from 'nanoid';
import format from 'date-fns/format';
import {createInterface} from 'readline';

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
 * @param encoding
 * @returns {string} path of saved file.
 */
export const saveCSV = (
  filePath: string,
  data: string,
  encoding: 'utf8' | 'Shift_JIS' = 'Shift_JIS',
) => {
  fs.writeFileSync(filePath, '');

  const fd = fs.openSync( filePath, 'w');
  const buff = iconv.encode(
    data.replace(/²/g, '2'),
    encoding,
  );

  fs.writeSync( fd, buff);
  fs.close(fd);

  return filePath;
};

/**
 * Save json to csv
 * @param filePath
 * @param json
 * @param encoding
 * @returns {string} file path
 */
export const saveJSONToCSV = async (
  filePath: string,
  json: {[k: string]: any}[],
  encoding: 'utf8' | 'Shift_JIS' = 'Shift_JIS',
) =>{
  if (!json.length) return;
  const dir = path.dirname(filePath);
  fs.existsSync(dir) || fs.mkdirSync(dir, {recursive: true});
  return saveCSV(
    filePath + '.csv',
    await json2csvAsync(json),
    encoding,
  );
};

/**
 * Save Serializable object into JSON file.
 *
 * @param filePath
 * @param data
 */
export const saveJSON = async (
  filePath: string,
  data: {[k: string]: any}[],

) => {
  try {
    fs.writeFileSync(filePath + '.json', JSON.stringify(data));
  } catch (err: any) {
    logger.error(`Failed to save json file. ${err.message}`);
  }
};

/**
 * Save any type of file.
 *
 * @param filePath
 * @param data
 */
export const saveFile = async (
  filePath: string,
  data: string,

) => {
  try {
    const dir = path.dirname(filePath);
    fs.existsSync(dir) || fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(filePath, data);
  } catch (err: any) {
    logger.error('Failed to save file ' + err.message);
  }
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

/**
 * CAUTION
 * This action is not recoverable.
 * @param dir directory where files will be deleted
 */
export const deleteFilesInFolder = async (dir: string) =>{
// Still thinking if I will include this as it is damaging.
  try {
    const files = await asyncFs.readdir(dir);
    for (const file of files) {
      await asyncFs.unlink(path.join(dir, file));
    }
  } catch (err: any) {
    logger.error(`Failed to delete all files from ${dir}. ${err.message}`);
  }
};

/**
 * All files in the folder will be moved to archived folder
 * at the same directory
 * @param dir
 */
export const archiveFilesInFolder = (dir: string) =>{
  // ToDo
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
  fs.existsSync(dir) || fs.mkdirSync(dir, {recursive: true});

  const randomize = format(new Date(), `yyyyMMdd-HHmmss`) + `-${nanoid(5)}`;

  return path.join(
    dir,
    `${[appId, randomize, suffix]
      .filter(Boolean)
      .join('-')}`,
  );
};

export const readFirstLine = async (path: string) => {
  const inputStream = createReadStream(path, 'utf8');
  try {
    for await (const line of createInterface(inputStream)) return line;
    return ''; // If the file is empty.
  } finally {
    inputStream.destroy(); // Destroy file stream.
  }
};

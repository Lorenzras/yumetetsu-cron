/* eslint-disable max-len */
import path from 'path';
import {KStoreSettings} from '../../../../config';
import {deleteFilesInFolder, saveJSONToCSV} from '../../../../utils';
import {processCSV} from './processCSV';

export const saveTransformedCSV = async (
  record: AsyncReturnType<typeof processCSV>,
) => {
  const files : {
    storeId: string,
    filePath: string,
  }[] = [];

  const processedCSVDir = path.join(__dirname, 'csv');
  deleteFilesInFolder(processedCSVDir);

  for (const [storeId, rows] of Object.entries(record)) {
    const filePath = await saveJSONToCSV(
      path.join(processedCSVDir, storeId),
      rows,
      'utf8',
    );
    if (!filePath) throw new Error(`saveTransformedCSV : Invalid file path. ${storeId} ${path}`);
    files.push({storeId, filePath: filePath});
  }

  return files;
};

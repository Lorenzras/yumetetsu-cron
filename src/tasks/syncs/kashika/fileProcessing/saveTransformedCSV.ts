/* eslint-disable max-len */
import path from 'path';
import {deleteFilesInFolder, logger, saveJSONToCSV} from '../../../../utils';
import {processCSV} from './processCSV';

export const saveTransformedCSV = async (
  record: AsyncReturnType<typeof processCSV>,
) => {
  const files : {
    storeId: string,
    filePath: string,
    totalCount: number,
  }[] = [];

  const processedCSVDir = path.join(__dirname, 'csv');
  await deleteFilesInFolder(processedCSVDir);

  for (const [storeId, rows] of Object.entries(record)) {
    logger.info(`Saving processed csv to ${processedCSVDir}/${storeId}.csv`);

    const filePath = await saveJSONToCSV(
      path.join(processedCSVDir, storeId),
      rows,
      'utf8',
    );
    if (!filePath) throw new Error(`saveTransformedCSV : Invalid file path. ${storeId} ${path}`);
    files.push({
      storeId,
      totalCount: rows.length,
      filePath: filePath,
    });
  }

  return files;
};

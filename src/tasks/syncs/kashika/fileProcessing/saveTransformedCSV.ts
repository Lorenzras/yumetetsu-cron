import path from 'path';
import {saveJSONToCSV} from '../../../../utils';
import {processCSV} from './processCSV';

export const saveTransformedCSV = async (
  record: AsyncReturnType<typeof processCSV>,
) => {
  for (const [storeId, rows] of Object.entries(record)) {
    await saveJSONToCSV(
      path.join(__dirname, 'csv', storeId),
      rows,
      'utf8',
    );
  }
};


import {logger} from '../../../../../../utils/logger';
import {sleep} from '../../../../../../utils/sleep';
import {TClusterPage} from '../../../../browser/config';
import {downloadSingleStore} from './downloadSingleStore';


export const downloadAllStores = async (
  cluster: TClusterPage,
  stores: {
    value: string,
    text: string
  }[]) => {
  const results = await Promise.all(
    stores.map(async ({value, text})=>{
      try {
        const result = await cluster.execute(async ({page, worker}) => {
          logger.info(`Worker:  ${worker.id} ${value} ${text}`);
          return await downloadSingleStore(page, value);
        });

        console.log(result);
        return result;
      } catch (err: any) {
        logger.error(`Error: ${text} ${err.message}`);
      }
    }),
  );


  console.log('HELLO');

  return results;
};

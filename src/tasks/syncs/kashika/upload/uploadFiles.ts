import {KStoreSettings, storeSettings} from '../../../../config';
import {TClusterPage} from '../../../common/browser/config';
import {ocrWorker, TKasikaAccount} from '../config';
import {login} from './login';
import {uploadFile} from './uploadFile';

export const uploadFiles = async (
  cluster: TClusterPage,
  storeFiles: {
    storeId: string,
    filePath: string,
  }[],
) => {
  /** Upload to Kasika */


  await Promise.all(
    storeFiles.map(({storeId, filePath}) => {
      return cluster.execute(async ({page}) => {
        const worker = await ocrWorker();

        await login(
          page,
          worker,
          storeSettings[storeId as KStoreSettings] as TKasikaAccount,
        );

        await uploadFile({
          page,
          sourceFile: filePath,
          storeId: storeId as KStoreSettings,
        });

        await worker.terminate();
      });
    }),
  );
};

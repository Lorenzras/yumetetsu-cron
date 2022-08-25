import {
  KStoreSettings,
  storeSettings,
  TStoreSettingsItem,
} from '../../../../config';
import {TClusterPage} from '../../../common/browser/config';
import {ocrWorker} from '../config';
import {login} from './login';
import {uploadFile} from './uploadFile';
import {createScheduler} from 'tesseract.js';
import {logger} from '../../../../utils';

export const uploadFiles = async (
  cluster: TClusterPage,
  storeFiles: {
    storeId: string,
    filePath: string,
    totalCount: number,
  }[],
) => {
  const scheduler = createScheduler();

  for (let i = 0; i < +process.env.CLUSTER_MAXCONCURRENCY; i++ ) {
    try {
      scheduler.addWorker(await ocrWorker());
    } catch (err: any) {
      logger.error(`Failed to addWorder.${err.message}`);
    }
  }


  /** Upload to Kasika */
  await Promise.all(
    storeFiles.map(({storeId, filePath, totalCount}) => {
      logger.info(`Uploading ${storeId} ${filePath}`);
      return cluster.execute(async ({page, worker: {id}}) => {
        await page.setDefaultNavigationTimeout(0);
        await login(
          page,
          scheduler,
          storeSettings[storeId as KStoreSettings] as TStoreSettingsItem,
          id,
        );

        await uploadFile({
          page,
          sourceFile: filePath,
          storeId: storeId as KStoreSettings,
          totalCount,
        });
      });
    }),
  );

  // await worker.terminate();
  await scheduler.terminate();
};

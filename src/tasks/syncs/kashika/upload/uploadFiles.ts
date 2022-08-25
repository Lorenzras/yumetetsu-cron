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

  for (let i = 0; i < 5; i++ ) {
    scheduler.addWorker(await ocrWorker());
  }


  /** Upload to Kasika */
  await Promise.all(
    storeFiles.map(({storeId, filePath, totalCount}) => {
      return cluster.execute(async ({page, worker: {id}}) => {
        logger.info(`Uploading ${storeId} ${filePath} ${id}`);
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

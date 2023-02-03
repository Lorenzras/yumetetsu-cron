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
  try {
    for (let i = 0; i < 5; i++ ) {
      scheduler.addWorker(await ocrWorker());
    }


    /** Upload to Kasika */
    await Promise.all(
      storeFiles.map(({storeId, filePath, totalCount}) => {
        return cluster.execute(async ({page, worker: {id}}) => {
          logger.info(`Uploading ${storeId} ${filePath} ${id}`);
          page.setDefaultNavigationTimeout(120000);

          /** 普段「 顧客一括登録・変更」ボタンを押したて、
           * やっと「一括アップロード」をクリックしますが、
           * ここでは直接アップロード画面に移行します。
          */
          await page.goto('https://kasika.io/customer-csv-upload?step=upload', {waitUntil: 'domcontentloaded'});
          if (page.url().includes('login.php')) {
            await login(
              page,
              scheduler,
              // storeSettings[storeId as KStoreSettings] as TStoreSettingsItem,
              // 一つのアカウントアップロードしてもよさそう
              storeSettings['270'] as TStoreSettingsItem,
              id,
            );
          }


          logger.info(`Logging in ${storeId}`);

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
  } catch (err : any) {
    logger.error(`Kasika RPA terminated with errors. ${err.message}`);
  } finally {
    await scheduler.terminate();
  }
};

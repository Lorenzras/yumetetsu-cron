import {openBrowserPage} from '../../common/browser';
import {login} from '../../common/doNet/login';
import {navigateToCustPage} from '../../common/doNet/pages/navigate';
import {
  downloadPerStore, selectStoreThenSearch,
} from '../../common/doNet/pages/customer/downloadPerStore';
import {
  uploadSingleCSVSmart,
} from '../../common/kintone/uploadCSV';
import {APP_IDS} from '../../../api/kintone';
import chokidar from 'chokidar';
import {deleteFile, logger, notifyDev} from '../../../utils';
import {setCustForm} from '../../common/doNet/pages/customer/setCustForm';

import {format, subDays} from 'date-fns';
import {Browser, Page} from 'puppeteer';
import {handleDownload} from '../../common/doNet/helpers/handleDownload';
import {donetCSVEndpoint, donetDownloadPath} from './config';
import path from 'path';


export const handleFileWatcher = async (filePath: string, browser: Browser) => {
  try {
    const context = await browser.createIncognitoBrowserContext();
    const newPage = await context.newPage();
    newPage.setDefaultNavigationTimeout(0);
    logger.info(`Adding to upload que: ${path.basename(filePath)}`);
    await uploadSingleCSVSmart({
      page: newPage,
      fileWithAppId: filePath,
      keyField: 'custId',
    });
    await Promise.all([
      deleteFile(filePath),
      newPage.close(),
    ]);
  } catch (e) {
    notifyDev(`handleFileWatcher ${e}`);
    browser.close();
  }
};

export const handleDownloadCust = async (page: Page) => {
  const filePath = await handleDownload({
    page,
    appId: APP_IDS.customers,
    downloadDir: donetDownloadPath,
    requestURL: donetCSVEndpoint,
  });

  if (filePath) {
    await uploadSingleCSVSmart({
      page,
      fileWithAppId: filePath,
      keyField: 'custId',
    });
    await deleteFile(filePath);
  }
};

export const syncDoNetCust = async (isFullSync = false) => {
/*   const watcher = chokidar.watch(donetDownloadPath, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
    depth: 0,
  }); */
  try {
    /** File watcher */


    process.setMaxListeners(20);
    const page = await openBrowserPage();
    // const kintoneBrowser = page.browser();

    // const uploadTasks : Promise<void>[] = [];

    /*   watcher.on('add', (filePath)=>{
      uploadTasks.push(handleFileWatcher(filePath, kintoneBrowser));
    }); */

    await login(page);
    await navigateToCustPage(page);

    if (isFullSync) {
      logger.info('Starting full sync.');
      await downloadPerStore(page);
    } else {
      // Incremental Sync
      logger.info('Starting incremental sync.');

      await setCustForm(
        page, {
          chkStatus: false,
          dateStr: format(subDays(new Date(), 1), 'yyyy-MM-dd')},
      );
      await selectStoreThenSearch(page, '');
      await handleDownloadCust(page);
      // await handleDownload(page);
      /* const filePath = await handleDownload({
        page,
        appId: APP_IDS.customers,
        downloadDir: donetDownloadPath,
        requestURL: donetCSVEndpoint,
      });

      if (filePath) {
        await uploadSingleCSVSmart({
          page,
          fileWithAppId: filePath,
          keyField: 'custId',
        });
      } */
    }

    // Wait a second to register all promises upload promises to stack.
    await page.waitForTimeout(2000);


    // await Promise.all(uploadTasks);

    await page.browser().close();
    // await kintoneBrowser.close();
    // await watcher.close();
  } catch (error: any) {
    // await watcher.close();
    await notifyDev(`Error with syncDoNetCust. ${error.message}`);
  }
};

import {logger} from './../../../utils/logger';
import {
  IConcurrentData,
  downloadTask,
  downloadPerStore,
  dlPathDonetProperty,
} from '../../common/doNet/pages/properties/';
import {Cluster} from 'puppeteer-cluster';
import {blockImages, getExtraPuppeteer} from '../../common/browser';
import chokidar from 'chokidar';
import {Page} from 'puppeteer';
import {uploadSingleCSVSmart} from '../../common/kintone/uploadCSV';
import {deleteFile} from '../../../utils';
import path from 'path';

const initCluster = async (
  maxConcurrency = 8,
  concurrency = Cluster.CONCURRENCY_CONTEXT) => {
  return await Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency,
    maxConcurrency,
    timeout: 6000000,
    retryLimit: 2,
    puppeteerOptions: {
      headless: false,
      defaultViewport: null,
      // args: ['--start-maximized'],
    },
  }) as Cluster<IConcurrentData>;
};

const initFileWatcher = () => {
  return chokidar.watch(dlPathDonetProperty, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    ignoreInitial: true,
    depth: 0,
  });
};

const uploadTask = async (page: Page, file: string) => {
  await blockImages(page);
  await uploadSingleCSVSmart({
    page,
    fileWithAppId: file,
    keyField: 'propertyId',
  });

  // Clean up
  page.removeAllListeners();
  await deleteFile(file);
  logger.info('Finished upload task for ' + path.basename(file));
};

export const syncDoNetProperties = async (isFullSync = false) => {
  const cluster = await initCluster(8);
  const watcher = initFileWatcher();

  watcher.on('add', (path)=>{
    cluster.queue(({page})=> uploadTask(page, path));
  });

  await cluster.task(downloadTask);

  downloadPerStore(cluster, isFullSync);

  await cluster.idle();
  await cluster.close();
  await watcher.close();
};

import {
  IConcurrentData,
  downloadTask,
  downloadPerStore,
  dlPathDonetProperty,
} from '../../common/doNet/pages/properties/';
import {Cluster} from 'puppeteer-cluster';
import {getExtraPuppeteer} from '../../common/browser';
import chokidar from 'chokidar';
import {Page} from 'puppeteer';
import {uploadSingleCSVSmart} from '../../common/kintone/uploadCSV';
import {deleteFile} from '../../../utils';

const initCluster = async () => {
  return await Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 8,
    timeout: 6000000,
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
    persistent: true,
    depth: 0,
  });
};

const uploadTask = async (page: Page, file: string) => {
  await uploadSingleCSVSmart({
    page,
    fileWithAppId: file,
    keyField: 'propertyId',
  });

  await deleteFile(file);
};

export const syncDoNetProperties = async (isFullSync = false) => {
  const cluster = await initCluster();
  const watcher = initFileWatcher();

  watcher.on('add', (path)=>{
    cluster.queue(({page})=> uploadTask(page, path));
  });

  await cluster.task(downloadTask);

  await downloadPerStore(cluster, isFullSync);

  await cluster.idle();
  await cluster.close();

  await watcher.close();
};

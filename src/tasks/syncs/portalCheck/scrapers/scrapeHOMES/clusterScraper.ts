
import {IPropertyAction} from '../../types';
import {getExtraPuppeteer} from '../../../../common/browser/openBrowser';
import {browserTimeOut} from '../../../../common/browser/config';
import {logger} from '../../../../../utils/logger';
import {Cluster} from 'puppeteer-cluster';
import {clusterTask} from './clusterTask';
import {byAction} from './clusterQueues/byAction';
import chokidar from 'chokidar';
import {dlPortalCheck} from '../../config';
import {uploadTask} from '../../clusterTasks/uploadTask';


export interface IClusterTaskData extends IPropertyAction {
  pref: string,
  cities: string[]
}

const initCluster = () => Cluster.launch({
  puppeteer: getExtraPuppeteer(),
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: 5,
  retryLimit: 2,
  retryDelay: 2000,
  puppeteerOptions: {
    headless: false,
  },
  timeout: browserTimeOut,
});

const initFileWatcher = () => {
  return chokidar.watch(dlPortalCheck, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    ignoreInitial: true,
    depth: 0,
  });
};


/**
 * Concurrent processing of actions defined above.
 * Refer to scrapeHOMES for synchronous processing.
 */
export const clusterScraper = async () => {
  const cluster : Cluster<IClusterTaskData> = await initCluster();
  const watcher = initFileWatcher();

  watcher.on('add', (path)=>{
    cluster.execute(({page})=> uploadTask(page, path));
  });

  logger.info(`Starting cluster.`);

  cluster.on('taskerror', (err, data) => {
    logger.error(`Error crawling : ${err.message} ${data}`);
  });

  await cluster.task(clusterTask);

  await byAction(cluster);


  await cluster.idle();
  await cluster.close();
};

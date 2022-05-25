import {scraperTask} from './clusterTasks/scraperTask';
import {getExtraPuppeteer} from '../../common/browser';
import {Cluster} from 'puppeteer-cluster';
import {browserTimeOut} from '../../common/browser/config';
import chokidar from 'chokidar';
import {dlPortalCheck} from './config';
import {logger} from '../../../utils';
import {uploadTask} from './clusterTasks/uploadTask';
import {actionsHOMES} from './scrapers/scrapeHOMES';
import {Page} from 'puppeteer';

export const initCluster = () => Cluster.launch({
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
export const portalCheckMainTask = async () => {
  const cluster : Cluster<{page: Page}> = await initCluster();
  const watcher = initFileWatcher();

  watcher.on('add', async (path)=>{
    return await cluster.execute(({page})=> uploadTask(page, path));
  });

  logger.info(`Starting cluster.`);

  cluster.on('taskerror', (err, data) => {
    logger.error(`Error crawling : ${err.message} ${data}`);
  });

  const actions = [
    ...actionsHOMES(),

  ];

  scraperTask(actions, cluster);


  await cluster.idle();
  await cluster.close();
  await watcher.close();
};

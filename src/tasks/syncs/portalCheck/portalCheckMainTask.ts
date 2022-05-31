import {openBrowserPage} from './../../common/browser/openBrowser';
import {scraperTask} from './clusterTasks/scraperTask';
import {getExtraPuppeteer} from '../../common/browser';
import {Cluster} from 'puppeteer-cluster';
import {browserTimeOut} from '../../common/browser/config';
import chokidar from 'chokidar';
import {dlPortalCheck} from './config';
import {logger, sleep} from '../../../utils';
import {uploadTask} from './clusterTasks/uploadTask';
import {actionsHOMES} from './scrapers/scrapeHOMES';
import {Page} from 'puppeteer';
import {actionsAtHome} from './scrapers/scrapeAtHome/actionsAtHome';


export const initCluster = () => Cluster.launch({
  puppeteer: getExtraPuppeteer(),
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: +process.env.CLUSTER_MAXCONCURRENCY ?? 5,
  // monitor: true,
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
    persistent: false,
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


  watcher.on('add', (path)=>{
    cluster
      .execute(({page}) => uploadTask(page, path));
  });

  logger.info(`Starting cluster.`);

  cluster.on('taskerror', (err, data) => {
    logger.error(`Error crawling : ${err.message} ${data}`);
  });

  const actions = [
    ...actionsHOMES(),
    ...actionsAtHome(),
  ];

  await scraperTask(actions, cluster);


  logger.info('Closing watcher');
  await watcher.close();

  await cluster.idle();
  logger.info('Cluster is now idle.');
  await cluster.close();
  logger.info('Cluster is closed.');
};

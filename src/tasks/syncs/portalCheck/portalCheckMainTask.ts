
import {Page} from 'puppeteer';
import {scraperTask} from './clusterTasks/scraperTask';
import {getExtraPuppeteer} from '../../common/browser';
import {Cluster} from 'puppeteer-cluster';
import {browserTimeOut, minimalArgs} from '../../common/browser/config';
// import chokidar from 'chokidar';
// import {dlPortalCheck} from './config';
import {logger, sleep} from '../../../utils';
import {uploadTask} from './clusterTasks/uploadTask';
import {actionsHOMES} from './scrapers/scrapeHOMES';
import {actionsAtHome} from './scrapers/scrapeAtHome/actionsAtHome';
import {
  suumoActions as actionsSUUMO,
} from './scrapers/scrapeSUUMO/suumoActions';
import {
  yahooActions as actionsYahoo,
} from './scrapers/scrapeYahoo/yahooActions';

export const initCluster = () => Cluster.launch({
  puppeteer: getExtraPuppeteer(),
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: +process.env.CLUSTER_MAXCONCURRENCY || 5,
  // monitor: true,
  workerCreationDelay: 300,
  puppeteerOptions: {
    // slowMo: 100,
    headless: process.env.BROWSER_TYPE === 'HEADLESS',
    // args: minimalArgs,
  },
  retryLimit: 1,
  retryDelay: 5000,
  timeout: 1000 * 60 * 8,
});

/* const initFileWatcher = () => {
  return chokidar.watch(dlPortalCheck, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    ignoreInitial: true,
    persistent: false,
    depth: 0,
  });
}; */


/**
 * Concurrent processing of actions defined above.
 * Refer to scrapeHOMES for synchronous processing.
 *
 * @param saveToNetWorkDrive Save to networkdrive or not.
 */
export const portalCheckMainTask = async (saveToNetWorkDrive = true) => {
  const cluster : Cluster<{page: Page}> = await initCluster();

  logger.info(`Starting cluster.`);

  cluster.on('taskerror', (err, data) => {
    logger.error(`Error crawling : ${err.message} ${data}`);
  });

  const actions = [
    ...actionsHOMES(),
    ...actionsAtHome(),
    ...actionsSUUMO(),
    ...actionsYahoo(),
    // actionsSUUMO()[2],
  ];

  await scraperTask(actions, cluster, saveToNetWorkDrive);


  // Rest, to make sure all tasks got registered especially for slow computers

  await sleep(10000);

  await cluster.idle();
  logger.info('Cluster is now idle.');
  await cluster.close();
  logger.info('Cluster is closed.');
};

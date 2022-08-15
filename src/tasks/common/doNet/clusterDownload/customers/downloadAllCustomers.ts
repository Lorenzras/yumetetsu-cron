import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {logger, sleep} from '../../../../../utils';
import {getExtraPuppeteer} from '../../../browser';
import {getDonetStores} from '../../pages/customer';
import {downloadAllStores} from './downloadStores/downloadAllStores';

export const initCluster = () => Cluster.launch({
  puppeteer: getExtraPuppeteer(),
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: +process.env.CLUSTER_MAXCONCURRENCY || 5,
  // monitor: true,
  workerCreationDelay: 100,

  puppeteerOptions: {
    // slowMo: 100,
    headless: process.env.BROWSER_TYPE === 'HEADLESS',
    // args: minimalArgs,
  },
  retryLimit: 2,
  retryDelay: 20000,
  timeout: 1000 * 60 * 8,
});


export const downloadAllCustomers = async () => {
  const cluster : Cluster<{page: Page}> = await initCluster();

  cluster.on('taskerror', (err, data) => {
    logger.error(`Error crawling : ${err.message} ${data}`);
  });

  const stores = await getDonetStores();

  const result = await downloadAllStores(cluster, stores);
  console.log('Result', result);

  await sleep(5000);

  await cluster.idle();
  logger.info('Cluster is now idle.');
  await cluster.close();
  logger.info('Cluster is closed.');
};


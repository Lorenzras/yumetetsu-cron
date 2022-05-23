
import {IPropertyAction} from '../../types';
import {getExtraPuppeteer} from '../../../../common/browser/openBrowser';
import {browserTimeOut} from '../../../../common/browser/config';
import {logger} from '../../../../../utils/logger';
import {Cluster} from 'puppeteer-cluster';

// import puppeteer from 'puppeteer-extra';
// import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import {clusterTask} from './clusterTask';
import {byAction} from './clusterQueues/byAction';


export interface IClusterTaskData extends IPropertyAction {
  pref: string,
  cities: string[]
}


/**
 * Concurrent processing of actions defined above.
 * Refer to scrapeHOMES for synchronous processing.
 */
export const clusterScraper = async () => {
  const cluster: Cluster<IClusterTaskData> = await Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    retryLimit: 2,
    puppeteerOptions: {
      headless: false,

    },
    timeout: browserTimeOut,
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

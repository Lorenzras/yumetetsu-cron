import {Cluster} from 'puppeteer-cluster';
import {getExtraPuppeteer} from '../../../browser';

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
  const cluster = await initCluster();
};

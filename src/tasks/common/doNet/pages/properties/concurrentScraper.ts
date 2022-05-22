import {getExtraPuppeteer} from './../../../browser/openBrowser';
import {IConcurrentData} from './types';
import {downloadTask, IPropForm} from './downloadTask';
import {Cluster} from 'puppeteer-cluster';
import {downloadPerStore} from './queues/downloadPerStore';

export const concurrentScrapper = async () => {
  const cluster: Cluster<IConcurrentData, IPropForm> = await Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 8,
    timeout: 6000000,
    puppeteerOptions: {
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized'],
    },
  });

  await cluster.task(downloadTask);

  await downloadPerStore(cluster);

  await cluster.idle();
  await cluster.close();
};

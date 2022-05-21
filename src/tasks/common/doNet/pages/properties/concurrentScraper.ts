import {IConcurrentData} from './types';
import {downloadTask} from './downloadTask';
import {Cluster} from 'puppeteer-cluster';
import {downloadPerStore} from './queues/downloadPerStore';

export const concurrentScrapper = async () => {
  const cluster: Cluster<IConcurrentData> = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 7,
    timeout: 600000,
    puppeteerOptions: {
      headless: false,
    },
  });

  await cluster.task(downloadTask);

  await downloadPerStore(cluster);

  await cluster.idle();
  await cluster.close();
};

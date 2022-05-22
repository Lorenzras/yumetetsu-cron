import {
  IConcurrentData,
  IPropForm,
  downloadTask,
  downloadPerStore} from '../../common/doNet/pages/properties/';
import {Cluster} from 'puppeteer-cluster';
import {getExtraPuppeteer} from '../../common/browser';

export const syncDoNetProperties = async () => {
  const cluster: Cluster<IConcurrentData, IPropForm> = await Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 8,
    timeout: 6000000,
    puppeteerOptions: {
      headless: false,
      defaultViewport: null,
      // args: ['--start-maximized'],
    },
  });

  await cluster.task(downloadTask);

  await downloadPerStore(cluster);

  await cluster.idle();
  await cluster.close();
};

/* eslint-disable max-len */
import {Cluster} from 'puppeteer-cluster';
import {logger} from '../../../../../utils/logger';
import {TClusterPage} from '../../../browser/config';
import {getExtraPuppeteer, initCluster} from '../../../browser/openBrowser';
import {downloadAllCustomers} from './downloadAllCustomers';
import {downloadProcess} from './downloadProcess';


export const downloadCustomers = async (options?: IFormOptions,
) => {
  const cluster : TClusterPage = await initCluster({
    maxConcurrency: 5,
  });
  cluster.on('taskerror', (err, data) => {
    logger.error(`Error crawling : ${err.message} ${data}`);
  });

  const {
    updatedFrom, updateUntil,
  } = options ?? {};


  /**
   * Download all based on following condition
   */
  if (options && (updatedFrom || updateUntil)) {
    const count = await cluster.execute(async ({page}) => {
      return await downloadProcess(page, options);
    });
    logger.info(`Filtered by dates ${updatedFrom} ~ ${updateUntil} : ${count}件`);
  } else {
    await downloadAllCustomers(cluster);
  }


  await cluster.idle();
  logger.info('Cluster is now idle.');
  await cluster.close();
  logger.info('Cluster is closed.');
};

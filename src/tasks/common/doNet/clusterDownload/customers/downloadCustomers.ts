/* eslint-disable max-len */
import {cookiesPath, deleteFilesInFolder} from '../../../../../utils';
import {logger} from '../../../../../utils/logger';
import {TClusterPage} from '../../../browser/config';
import {initCluster} from '../../../browser/openBrowser';
import {downloadDir} from './config';
import {downloadAllCustomers} from './downloadAllCustomers';
import {downloadProcess} from './downloadProcess';


export const downloadCustomers = async (cluster: TClusterPage, options?: IFormOptions,
) => {
  const {
    updatedFrom,
    updateUntil,
    dir = downloadDir,
  } = options ?? {};

  /** Clear cookies
   * Reason: Donet has a bug where no error is thrown but a part of the site's data is unaccesible with expired cookies.
  */
  deleteFilesInFolder(cookiesPath);
  /** Clear download dir */
  deleteFilesInFolder(dir);

  /**
   * Download all based on following condition
   */
  if (options && (updatedFrom || updateUntil)) {
    const count = await cluster.execute(async ({page, worker: {id}}) => {
      return await downloadProcess(page, {...options, workerId: id});
    });
    logger.info(`Filtered by dates ${updatedFrom} ~ ${updateUntil} : ${count}件`);
  } else {
    await downloadAllCustomers(cluster);
  }


  return dir;
  // await cluster.idle();
  // logger.info('Cluster is now idle.');
  // await cluster.close();
  // logger.info('Cluster is closed.');
};

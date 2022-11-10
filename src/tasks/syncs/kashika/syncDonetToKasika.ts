
import {logger} from '../../../utils';
import {initCluster} from '../../common/browser';
import {TClusterPage} from '../../common/browser/config';
import {downloadDir} from '../../common/doNet/clusterDownload/customers/config';

import {
  downloadCustomers,
} from '../../common/doNet/clusterDownload/customers/downloadCustomers';
import {initialFormOptions} from './config';
import {processCSV} from './fileProcessing/processCSV';
import {saveTransformedCSV} from './fileProcessing/saveTransformedCSV';

import {uploadFiles} from './upload/uploadFiles';


export const syncDonetToKasika = async () => {
  const cluster : TClusterPage = await initCluster({
    maxConcurrency: 5,
    puppeteerOptions: {
      headless: false,
      defaultViewport: null,
    },

  });

  const rawCSVDir = await downloadCustomers(cluster, initialFormOptions);
  logger.info('Done: downloadCustomers');
  const groupedByStoreJSON = await processCSV(rawCSVDir);
  logger.info('Done: processCSV');
  const storeFiles = await saveTransformedCSV(groupedByStoreJSON);
  logger.info('Done: saveTransformedCSV');

  /** Upload to Kasika */
  await uploadFiles(cluster, storeFiles);
  logger.info('Done: uploadFiles');


  await cluster.idle();
  logger.info('Cluster is now idle.');
  await cluster.close();
  logger.info('Cluster is closed.');
};

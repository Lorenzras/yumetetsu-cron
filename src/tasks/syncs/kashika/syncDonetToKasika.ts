import {
  KStoreSettings,
  storeSettings,
} from '../../../config';
import {logger} from '../../../utils';
import {initCluster} from '../../common/browser';
import {TClusterPage} from '../../common/browser/config';


import {
  downloadCustomers,
} from '../../common/doNet/clusterDownload/customers/downloadCustomers';
import {ocrWorker, TKasikaAccount} from './config';
import {processCSV} from './fileProcessing/processCSV';
import {saveTransformedCSV} from './fileProcessing/saveTransformedCSV';
import {login} from './upload/login';
import {uploadFile} from './upload/uploadFile';
import {uploadFiles} from './upload/uploadFiles';


export const syncDonetToKasika = async () => {
  const cluster : TClusterPage = await initCluster({
    maxConcurrency: 5,
  });

  const rawCSVDir = await downloadCustomers(cluster);
  const groupedByStoreJSON = await processCSV(rawCSVDir);
  const storeFiles = await saveTransformedCSV(groupedByStoreJSON);

  /** Upload to Kasika */
  await uploadFiles(cluster, storeFiles);


  await cluster.idle();
  logger.info('Cluster is now idle.');
  await cluster.close();
  logger.info('Cluster is closed.');
};

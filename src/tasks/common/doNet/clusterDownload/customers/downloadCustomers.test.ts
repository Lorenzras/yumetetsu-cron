import {logger} from './../../../../../utils/logger';
import {initCluster} from '../../../browser';
import {browserTimeOut, TClusterPage} from '../../../browser/config';
import {downloadCustomers} from './downloadCustomers';

describe('customers', ()=>{
  it('should be able to download customers', async ()=>{
    const cluster : TClusterPage = await initCluster({
      maxConcurrency: 5,
    });

    await downloadCustomers(cluster, {
      storeId: '',
      status: ['追客中'],
    });


    await cluster.idle();
    logger.info('Cluster is now idle.');
    await cluster.close();
    logger.info('Cluster is closed.');
    expect(true);
  }, browserTimeOut);
});

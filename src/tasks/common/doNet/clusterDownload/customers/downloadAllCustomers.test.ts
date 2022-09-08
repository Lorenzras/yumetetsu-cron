import {initCluster} from '../../../browser';
import {browserTimeOut, TClusterPage} from '../../../browser/config';
import {downloadAllCustomers} from './downloadAllCustomers';

describe('customers', ()=>{
  it('should download all customers', async ()=>{
    const cluster : TClusterPage = await initCluster({
      maxConcurrency: 1,
      puppeteerOptions: {
        slowMo: 100,
      },
    });

    const result = await downloadAllCustomers(cluster, {
      storeId: '',
      status: ['追客中'],
    });
    await cluster.idle();
    await cluster.close();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

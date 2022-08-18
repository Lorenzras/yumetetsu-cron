import {initCluster} from '../../../browser';
import {browserTimeOut, TClusterPage} from '../../../browser/config';
import {downloadCustomers} from './downloadCustomers';

describe('customers', ()=>{
  it('should be able to download customers', async ()=>{
    const cluster : TClusterPage = await initCluster({
      maxConcurrency: 5,
    });
    await downloadCustomers(cluster);
    expect(true);
  }, browserTimeOut);
});

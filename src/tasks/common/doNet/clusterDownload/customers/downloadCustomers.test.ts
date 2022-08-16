import {browserTimeOut} from '../../../browser/config';
import {downloadCustomers} from './downloadCustomers';

describe('customers', ()=>{
  it('should be able to download customers', async ()=>{
    await downloadCustomers();
    expect(true);
  }, browserTimeOut);
});

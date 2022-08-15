import {browserTimeOut} from '../../../browser/config';
import {downloadAllCustomers} from './downloadAllCustomers';

describe('customers', ()=>{
  it('should download all customers', async ()=>{
    const result = await downloadAllCustomers();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

import {browserTimeOut} from '../../../common/browser/config';
import {testExcel} from './readExcel';

test('test', async ()=>{
  await testExcel();
}, browserTimeOut);

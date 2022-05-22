import {browserTimeOut} from '../../common/browser/config';
import {syncDoNetProperties} from './syncDonetProperties';

test('Properties', async ()=>{
  await syncDoNetProperties();
}, browserTimeOut);

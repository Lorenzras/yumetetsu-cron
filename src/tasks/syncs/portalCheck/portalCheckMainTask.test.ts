import {browserTimeOut} from '../../common/browser/config';
import {portalCheckMainTask} from './portalCheckMainTask';
test('portalCheckMainProcess', async ()=>{
  await portalCheckMainTask();
}, browserTimeOut);

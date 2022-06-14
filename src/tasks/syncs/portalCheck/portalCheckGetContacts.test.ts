import {browserTimeOut} from '../../common/browser/config';
import {portalCheckGetContacts} from './portalCheckGetContacts';

test('getContacts', async ()=>{
  await portalCheckGetContacts();
}, browserTimeOut);

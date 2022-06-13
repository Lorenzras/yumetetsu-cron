/* eslint-disable max-len */
import {IProperty} from './../types';
import {browserTimeOut} from './../../../common/browser/config';
import {saveMeta} from './saveMeta';
// import before from './test/199-20220605-193449-A84sd--doComparedDt-5470.json';
// import after from './test/199-20220605-195446-zDzyj--finalResults-2451.json';
import before from '../../../../../downloads/json/portalCheck/199-20220612-235529-hw--7--doComparedDt-5476.json';
import after from '../../../../../downloads/json/portalCheck/199-20220613-002428-MvI82--finalResults-2414.json';
test('meta', ()=>{
  saveMeta(before as IProperty[], after as IProperty[], false);
}, browserTimeOut);

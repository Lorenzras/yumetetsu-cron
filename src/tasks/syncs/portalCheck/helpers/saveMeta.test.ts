/* eslint-disable max-len */
import {IProperty} from './../types';
import {browserTimeOut} from './../../../common/browser/config';
import {saveMeta} from './saveMeta';
// import before from './test/199-20220605-193449-A84sd--doComparedDt-5470.json';
// import after from './test/199-20220605-195446-zDzyj--finalResults-2451.json';
import before from '../../../../../downloads/json/portalCheck/199-20220610-054541-GGu5z--doComparedDt-75.json';
import after from '../../../../../downloads/json/portalCheck/199-20220618-005530-QKlz1--finalResults-2352.json';
import os from 'os';
const hostname = os.hostname();
test('meta', ()=>{
  console.log(hostname);
  // saveMeta(before as IProperty[], after as IProperty[], false);
  saveMeta({
    beforeGetContact: before as IProperty[],
    afterGetContact: after as IProperty[],
    saveToNetWorkDrive: false,
    startTime: new Date(),
  });
}, browserTimeOut);

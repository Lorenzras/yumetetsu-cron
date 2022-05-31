import {browserTimeOut} from '../../common/browser/config';
import {portalCheckMainTask} from './portalCheckMainTask';
import _ from 'lodash';

describe('portalCheckMainProcess', ()=>{
  test('main', async ()=>{
    await portalCheckMainTask();
    expect('');
  }, browserTimeOut);
});

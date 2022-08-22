import {browserTimeOut} from '../../common/browser/config';
import {syncDonetToKasika} from './syncDonetToKasika';

describe('main', ()=>{
  it('should sync donet customers to kasika', async ()=>{
    await syncDonetToKasika();
  }, browserTimeOut);
});

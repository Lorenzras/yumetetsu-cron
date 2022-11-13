import {syncDonetToKasika} from './syncDonetToKasika';

describe('main', ()=>{
  it('should sync donet customers to kasika', async ()=>{
    await syncDonetToKasika();
  }, 1000 * 60 * 60 * 5);
});

import {openBrowserPage} from '../../common/browser';
import {browserTimeOut} from '../../common/browser/config';
import {syncDonetToKasika} from './syncDonetToKasika';

describe('main', ()=>{
  it('should sync donet customers to kasika', async ()=>{
    const page = await openBrowserPage({
      // slowMo: 40,
      headless: false,
      loadImages: true,
    });
    await syncDonetToKasika(page);
  }, browserTimeOut);
});

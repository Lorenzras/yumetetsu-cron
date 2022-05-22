
import {openMockBrowserPage} from '../../browser';
import {browserTimeOut} from '../../browser/config';
import {navigateToCustPage} from './navigate';

describe('Customer Page', ()=> {
  it('navigated', async ()=>{
    const page = await openMockBrowserPage();
    const res = await navigateToCustPage(page);
    res.browser().disconnect();
    expect(res);
  }, browserTimeOut);
});

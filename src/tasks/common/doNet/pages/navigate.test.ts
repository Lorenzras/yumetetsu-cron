
import {openMockBrowserPage} from '../../browser';
import {browserTimeOut} from '../../browser/config';
import {navigateToCustPage, navigateToPropertyPage} from './navigate';

describe('navigate', ()=> {
  it('customer', async ()=>{
    const page = await openMockBrowserPage();
    const res = await navigateToCustPage(page);
    res.browser().disconnect();
    expect(res);
  }, browserTimeOut);

  it('property', async ()=>{
    const page = await openMockBrowserPage();
    const res = await navigateToPropertyPage(page);
    res.browser().disconnect();
    expect(res);
  }, browserTimeOut);
});


import {openBrowserPage} from '../../browser';
import {browserTimeOut} from '../../browser/config';
import {login} from '../login';
import {navigateToCustPage, navigateToPropertyPage} from './navigate';

describe('navigate', ()=> {
  it('customer', async ()=>{
    const page = await openBrowserPage({
      headless: false,
    });
    const res = await navigateToCustPage(page);
    res.browser().disconnect();
    expect(res);
  }, browserTimeOut);

  it('property', async ()=>{
    const page = await openBrowserPage({
      headless: false,
    });
    await login(page);
    const res = await navigateToPropertyPage(page);
    await page.browser().close();
    expect(res);
  }, browserTimeOut);
});

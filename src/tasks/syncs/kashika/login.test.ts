
import {openBrowserPage, openMockBrowserPage} from '../../common/browser';

import {login} from './login';

describe('kashika', ()=>{
  it('should be able to login kashika', async ()=>{
    // const page = await openMockBrowserPage();
    const page = await openBrowserPage({
      slowMo: 40,

    });
    await login(page);
    // await page.click('button[type=submit]');
    // await page.waitForNavigation();
    // const el = await page.$('div[role=alert]');
    // console.log(!el);

    // page.browser().disconnect();
    await page.close();
  }, 300000);
});

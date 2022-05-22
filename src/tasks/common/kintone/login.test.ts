import {URLs} from './config';
import {openBrowserPage, blockImages} from './../browser/openBrowser';
import {browserTimeOut} from './../browser/config';
import {login} from './login';

describe('Kintone Login', ()=>{
  it('is successful', async () => {
    const page = await openBrowserPage();
    await blockImages(page);
    await page.goto(URLs.login);
    await login(page);

    await page.waitForTimeout(3000);
    // page.browser().disconnect();
    page.removeAllListeners(); // cleanup
    await page.close();

    expect(page);
  }, browserTimeOut);
});

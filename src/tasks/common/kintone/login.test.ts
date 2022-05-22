import {URLs} from './config';
import {openBrowserPage} from './../browser/openBrowser';
import {browserTimeOut} from './../browser/config';
import {login} from './login';

describe('Kintone Login', ()=>{
  it('is successful', async () => {
    const page = await openBrowserPage();
    await page.goto(URLs.login);
    await login(page);

    // page.browser().disconnect();

    expect(page).toMatchSnapshot();
    await page.close();
  }, browserTimeOut);
});


import {openBrowserPage} from '../browser';
import {login} from './login';

describe('DoNet', ()=>{
  it('login successfully', async ()=>{
    const page = await openBrowserPage({headless: false});
    await login(page);

    await page.waitForTimeout(10000);
    await page.browser().close();
    expect(page).toBeDefined();
  }, 30000);
});

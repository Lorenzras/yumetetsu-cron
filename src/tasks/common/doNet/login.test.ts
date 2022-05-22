
import {openBrowserPage} from '../browser';
import {login} from './login';

describe('DoNet', ()=>{
  it('login successfully', async ()=>{
    const page = await openBrowserPage();
    await login(page);

    page.browser().disconnect();
    page.browser().close();
    expect(page).toBeDefined();
  }, 30000);
});

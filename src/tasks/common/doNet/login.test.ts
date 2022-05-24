
import {openBrowserPage} from '../browser';
import {login} from './login';

describe('DoNet', ()=>{
  it('login successfully', async ()=>{
    const page = await openBrowserPage();
    await login(page);


    expect(page).toBeDefined();
    page.browser().close();
  }, 30000);
});

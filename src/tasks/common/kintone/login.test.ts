import {openMockBrowserPage} from '../browser';
import {login} from './login';

describe('Kintone Login', ()=>{
  it('is successful', async () => {
    const page = await openMockBrowserPage();
    await login(page);

    page.browser().disconnect();

    expect(page).toMatchSnapshot();
  });
});

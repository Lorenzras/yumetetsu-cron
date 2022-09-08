import {openMockBrowserPage} from '../../../browser';
import {browserTimeOut} from '../../../browser/config';
import {
  downloadPerStore,
  selectStoreThenSearch} from './downloadPerStore';


describe('Stores', () => {
  it('are downloaded', async () => {
    const page = await openMockBrowserPage();
    const res = await downloadPerStore(page);

    page.browser().disconnect();
    expect(res);
  }, browserTimeOut);
});

describe('Search', () => {
  it('is downloaded', async () => {
    const page = await openMockBrowserPage();
    const res = await selectStoreThenSearch(page, '403');

    page.browser().disconnect();
    expect(res);
  }, browserTimeOut);
});


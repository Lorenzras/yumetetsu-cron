import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtLot, scrapePage} from './scrapeDtLot';

// sample link: https://www.homes.co.jp/tochi/aichi/toyokawa-city/list/

describe('scrapeDtLot', ()=>{
  test('allPages', async ()=>{
    const page = await openMockBrowserPage();
    const result = await scrapeDtLot(page);

    page.browser().disconnect();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);

  test('single page', async ()=>{
    const page = await openMockBrowserPage();
    const result = await scrapePage(page);

    page.browser().disconnect();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});


// homes.co.jp/tochi/aichi/list/?page=5

// へん
// https://www.homes.co.jp/tochi/b-17032980000140/

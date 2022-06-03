import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtLot, scrapeDtLotPage} from './scrapeDtLot';

// sample link: https://www.homes.co.jp/tochi/aichi/toyokawa-city/list/

describe('scrapeDtLot', ()=>{
  test('all', async ()=>{
    const page = await openMockBrowserPage();
    const result = await scrapeDtLot(page);

    page.browser().disconnect();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);

  test('single', async ()=>{
    const page = await openMockBrowserPage();
    await page.goto('https://www.homes.co.jp/tochi/aichi/toyokawa-city/list/', {waitUntil: 'domcontentloaded'});
    const result = await scrapeDtLotPage(page);

    page.browser().disconnect();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});


// homes.co.jp/tochi/aichi/list/?page=5

// へん
// https://www.homes.co.jp/tochi/b-17032980000140/

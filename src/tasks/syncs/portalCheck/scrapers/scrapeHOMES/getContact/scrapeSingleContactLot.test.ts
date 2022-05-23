import {scrapeContacts} from './scrapeContacts';
import {scrapeDtLot} from '../scrapeDtLot';
import {openMockBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';

// https://www.homes.co.jp/tochi/b-17069260000119/
// https://www.homes.co.jp/tochi/b-17063140000080/ stopped
describe(('scrapeContactLot'), ()=>{
  test('array', async ()=>{
    const page = await openMockBrowserPage();
    const results = [];
    const testVals = [
      'https://www.homes.co.jp/tochi/b-17069260000119/',
      'https://www.homes.co.jp/tochi/b-17063140000080/',

    ];
    for (const val of testVals) {
      await page.goto(val);
      const result = await scrapeSingleContactLot(page);
      results.push(result);
    }


    page.browser().disconnect();
    expect(results).toMatchSnapshot();
  }, browserTimeOut);

  test('mocked', async ()=>{
    // https:// www.homes.co.jp/tochi/aichi/shintoyota_07226-st/list/
    const page = await openMockBrowserPage();
    await page.goto('https://www.homes.co.jp/tochi/aichi/shintoyota_07226-st/list/');
    let results = [];
    const data = await scrapeDtLot(page);
    results = await scrapeContacts(page, data);
    expect(results).toMatchSnapshot();

    page.browser().disconnect();
  }, browserTimeOut);
});



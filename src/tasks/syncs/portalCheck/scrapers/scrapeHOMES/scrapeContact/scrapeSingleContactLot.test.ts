import {openMockBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';

// tochi: https://www.homes.co.jp/tochi/b-17069260000119/

test('scrapeContact', async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeSingleContactLot(page);
  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

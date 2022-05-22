import {openMockBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {scrapeSingleContact} from './scrapeSingleContact';

// kodate: https://www.homes.co.jp/kodate/b-1246970001816/
// tochi: https://www.homes.co.jp/tochi/b-17069260000119/

test('scrapeContact', async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeSingleContact(page);
  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

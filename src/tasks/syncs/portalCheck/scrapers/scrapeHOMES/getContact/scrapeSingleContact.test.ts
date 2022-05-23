import {blockImages, openBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {scrapeSingleContact} from './scrapeSingleContact';

// kodate: https://www.homes.co.jp/kodate/b-1246970001816/
// tochi: https://www.homes.co.jp/tochi/b-17069260000119/

test('scrapeContact', async ()=>{
  const page = await openBrowserPage();
  await blockImages(page);
  await page.goto('https://www.homes.co.jp/tochi/b-17069260000119/');

  const result = await scrapeSingleContact(page);
  // page.browser().disconnect();
  await page.close();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

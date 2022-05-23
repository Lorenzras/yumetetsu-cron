import {blockImages, openBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {getContactByLink, scrapeContacts} from './scrapeContacts';
import {scrapeSingleContact} from './scrapeSingleContact';

// kodate: https://www.homes.co.jp/kodate/b-1246970001816/
// tochi: https://www.homes.co.jp/tochi/b-17069260000119/

test('getContactByLink', async ()=>{
  const page = await openBrowserPage();
  await blockImages(page);
  const result = await getContactByLink(page, 'https://www.homes.co.jp/tochi/b-17069260000119/');
  await page.close();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

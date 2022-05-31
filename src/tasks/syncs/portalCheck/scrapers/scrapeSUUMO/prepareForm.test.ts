import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {prepareForm} from './prepareForm';

/* https://suumo.jp/ms/chuko/aichi/city/ */

test(('prepareForm'), async ()=>{
  const page = await openBrowserPage();
  // await page.goto('https://suumo.jp/ms/chuko/aichi/city');
  const result = await prepareForm(page, '愛知県', '中古戸建');

  // page.browser().disconnect();
  await page.close();
  expect(result).toBeTruthy();
}, browserTimeOut);

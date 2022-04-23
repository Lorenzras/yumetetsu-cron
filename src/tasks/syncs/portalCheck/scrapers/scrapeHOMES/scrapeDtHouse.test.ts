import {json2csvAsync} from 'json-2-csv';
import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {dirPortalCheck} from '../../config';
import {scrapeDtHouse} from './scrapeDtHouse';

// sample link: https://www.homes.co.jp/kodate/chuko/aichi/toyokawa-city/list/

test('Scrape House Data', async ()=>{
  console.log(dirPortalCheck);
  const page = await openMockBrowserPage();
  const result = await scrapeDtHouse(page);
  console.log(await json2csvAsync(result));
  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

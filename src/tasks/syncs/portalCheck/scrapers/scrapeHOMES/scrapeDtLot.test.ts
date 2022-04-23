import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {dirPortalCheck} from '../../config';
import {scrapeDtLot} from './scrapeDtLot';

// sample link: https://www.homes.co.jp/tochi/aichi/toyokawa-city/list/

test('Scrape House Data', async ()=>{
  console.log(dirPortalCheck);
  const page = await openMockBrowserPage();
  const result = await scrapeDtLot(page);

  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

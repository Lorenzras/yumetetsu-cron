import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtMansion} from './scrapeDtMansion';

// test few: https://www.homes.co.jp/mansion/chuko/aichi/toyokawa-city/list/

test('scrapeDtMansion', async () => {
  const page = await openMockBrowserPage();
  const result = await scrapeDtMansion(page);

  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

import {browserTimeOut} from '../../../../common/browser/config';
import {openMockBrowserPage} from '../../../../common/browser';
import {scrapeSUUMO} from './scrapeSUUMO';

// test page： https://suumo.jp/ms/chuko/

test('SUUMO', async () => {
  const page = await openMockBrowserPage();
  const result = await scrapeSUUMO(page);

  await page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

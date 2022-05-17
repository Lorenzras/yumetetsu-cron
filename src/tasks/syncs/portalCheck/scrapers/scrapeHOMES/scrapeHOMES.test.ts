import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeHOMES} from './scrapeHOMES';

test('HOMES', async () => {
  const page = await openBrowserPage();
  const result = await scrapeHOMES(page);

  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

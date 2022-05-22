import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeHOMES} from './scrapeSync';

test('HOMES', async () => {
  const page = await openBrowserPage({headless: true});
  const result = await scrapeHOMES(page);

  page.browser().close();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

import { openMockBrowserPage } from '../../../common/browser';
import { scrapeSUUMO } from './scrapeSUUMO';

test('main', async () => {
  const firstPage = await openMockBrowserPage();
  await firstPage.browser().disconnect();
  expect(await scrapeSUUMO(firstPage, 'https://suumo.jp/ms/chuko/aichi/city/')).toMatchSnapshot();
  
}, 100000);

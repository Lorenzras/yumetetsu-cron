import {
  openMockBrowserPage,
  openBrowserPage,
} from './../../../../../common/browser/openBrowser';
import {browserTimeOut} from './../../../../../common/browser/config';
import {getContactByLink} from './getContactByLink';
test('Contact', async ()=>{
  const page = await openBrowserPage();
  const links = [
    'https://www.homes.co.jp/mansion/b-1093100000760/',
    'https://www.homes.co.jp/mansion/b-1436460000425/',
    'https://www.homes.co.jp/mansion/b-1453580001292/',

  ];

  const results = [];

  for (const link of links) {
    results.push(await getContactByLink(page, link ));
  }

  await page.close();
  expect(results).toMatchSnapshot();
}, browserTimeOut);

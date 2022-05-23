import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';

import {searchDoProperty} from './searchDoProperty';

test('search', async () => {
  const page = await openMockBrowserPage();
  await Promise.all([
    page.waitForNavigation(),
    page.click('.sidebar-estate'),
  ]);

  const result = (await searchDoProperty({page, data: {
    address: '愛知県豊田市水源町６丁目1-65　',
    area: '76.83',
    price: '1600',
    propertyType: '中古マンション',
  }}))[0];

  page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

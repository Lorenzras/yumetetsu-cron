import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {IProperty} from '../types';
import {searchProperty} from './searchProperty';

test('search', async () => {
  const page = await openMockBrowserPage();
  await Promise.all([
    page.waitForNavigation(),
    page.click('.sidebar-estate'),
  ]);

  await searchProperty({page, data: {
    address: '愛知県豊田市山之手６丁目20-2　',
    area: 144,
    price: 3000,
    propertyType: '中古戸建',
  }});

  page.browser().disconnect();
  console.log('done');
}, browserTimeOut);

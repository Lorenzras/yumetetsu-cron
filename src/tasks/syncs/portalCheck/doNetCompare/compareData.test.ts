import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {compareData} from './compareData';

test('compare', async () => {
  const page = await openMockBrowserPage();
  await compareData(page, {
    address: '愛知県豊田市山之手６丁目20-2　',
    area: '144',
    price: '3000',
    propertyType: '中古戸建',
  });
  page.browser().disconnect();
}, browserTimeOut);

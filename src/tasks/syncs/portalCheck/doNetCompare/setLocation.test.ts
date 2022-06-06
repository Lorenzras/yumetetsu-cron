/* eslint-disable max-len */
import {openBrowserPage, openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {navigateToPropertyPage} from '../../../common/doNet/pages/navigate';
import {setLocation} from './setLocation';

test('location', async () => {
  const page = await openMockBrowserPage();
  await page.screenshot({path: 'C:\\Users\\owner\\Pictures\\Camera Roll\\test.png'});
  await navigateToPropertyPage(page);
  await setLocation({
    logSuffix: '',
    page, data: {
      pref: '岐阜県',
      city: '大垣市',
      town: '水源町',
    }});

  page.browser().disconnect();
}, browserTimeOut);

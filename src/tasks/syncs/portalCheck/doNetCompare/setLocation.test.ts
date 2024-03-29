/* eslint-disable max-len */
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {setLocation} from './setLocation';

test('location', async () => {
  const page = await openMockBrowserPage();


  // Must be in property page.
  await setLocation({
    logSuffix: '',
    page, data: {
      pref: '岐阜県',
      city: '大垣市',
      town: '水源町',
    }});

  page.browser().disconnect();
}, browserTimeOut);

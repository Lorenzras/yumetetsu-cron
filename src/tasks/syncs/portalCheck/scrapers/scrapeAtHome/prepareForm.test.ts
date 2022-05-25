import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {TProperty} from '../../types';
import {prepareForm} from './prepareForm';

test('prepareForm', async () => {
  const page = await openMockBrowserPage();
  for (const [pref, propType] of ([
    ['岐阜県', '中古戸建'],
    ['岐阜県', '土地'],
    ['岐阜県', '中古マンション'],
  ] as [string, TProperty ][])) {
    await prepareForm(page, pref, propType);
  }

  page.browser().disconnect();
}, browserTimeOut);

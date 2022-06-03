import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {TProperty} from '../../types';
import {handlePrepareForm} from './handlePrepareFoorm';

test('prepareForm', async () => {
  const page = await openMockBrowserPage();
  for (const [pref, propType] of ([
    ['愛知県', '中古戸建'],
    ['愛知県', '土地'],
    ['愛知県', '中古マンション'],
  ] as [string, TProperty ][])) {
    await handlePrepareForm(page, pref, propType);
  }

  page.browser().disconnect();
}, browserTimeOut);

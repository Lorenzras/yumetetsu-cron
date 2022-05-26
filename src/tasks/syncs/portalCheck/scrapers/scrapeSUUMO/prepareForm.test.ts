import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {prepareForm} from './prepareForm';

/* https://suumo.jp/ms/chuko/aichi/city/ */

test(('prepareForm'), async ()=>{
  const page = await openMockBrowserPage();
  await prepareForm(page, '愛知県', '土地');

  page.browser().disconnect();
}, browserTimeOut);

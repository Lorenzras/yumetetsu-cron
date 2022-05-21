import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {cityLists} from '../../config';
import {prepareForm} from './prepareForm';

/* https://suumo.jp/ms/chuko/aichi/city/ */

test(('prepareForm'), async ()=>{
  const page = await openMockBrowserPage();
  await prepareForm(page, cityLists.愛知);

  page.browser().disconnect();
}, browserTimeOut);

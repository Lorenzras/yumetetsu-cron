import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {searchClick} from './searchClick';

test(('searchClick'), async ()=>{
  const page = await openMockBrowserPage();
  await searchClick(page);

  page.browser().disconnect();
}, browserTimeOut);

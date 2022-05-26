import {openMockBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {cityLists} from '../../../config';
import {prepareForm} from './prepareForm';

test('prepareForm', async ()=>{
  const page = await openMockBrowserPage();
  await page.goto('https://www.athome.co.jp/kodate/chuko/aichi/city/');
  await prepareForm(page, Object.keys(cityLists['愛知県']));
  page.browser().disconnect();
}, browserTimeOut);

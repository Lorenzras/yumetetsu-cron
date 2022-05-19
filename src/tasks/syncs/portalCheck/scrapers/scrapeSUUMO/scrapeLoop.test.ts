import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeLoop} from './scrapeLoop';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=021&cn=9999999&cnb=0&ekTjCd=&ekTjNm=&hb=0&ht=9999999&kb=1&kt=9999999&sc=23201&ta=23&tb=0&tj=0&tt=9999999&bknlistmodeflg=2&pc=30 */

test(('scrapeLoop'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeLoop(page);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

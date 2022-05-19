import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtHouse} from './scrapeDtHouse';

/* https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/?ar=050&bs=021&ta=23&jspIdFlg=patternShikugun&sc=23221&kb=1&kt=9999999&tb=0&tt=9999999&hb=0&ht=9999999&ekTjCd=&ekTjNm=&tj=0&cnb=0&cn=9999999 */

test(('scrapeDtHouse'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeDtHouse(page);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtApartment} from './scrapeDtApartment';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=011&cn=9999999&cnb=0&ekTjCd=&ekTjNm=&kb=1&kt=9999999&mb=0&mt=9999999&sc=23207&sc=23236&ta=23&tj=0&bknlistmodeflg=2&pc=30 */

test(('scrapeDtApartment'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeDtApartment(page);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

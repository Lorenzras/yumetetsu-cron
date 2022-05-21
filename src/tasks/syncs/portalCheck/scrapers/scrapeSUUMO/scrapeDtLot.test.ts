import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtLot} from './scrapeDtLot';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=030&ekTjCd=&ekTjNm=&kb=1&kj=9&km=1&kt=9999999&sc=21202&ta=21&tb=0&tj=0&tt=9999999&bknlistmodeflg=2&pc=30 */

test(('scrapeDtLot'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeDtLot(page);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

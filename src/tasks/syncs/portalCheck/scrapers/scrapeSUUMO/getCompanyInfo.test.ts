import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {IProperty} from '../../types';
import {getCompanyInfo} from './getCompanyInfo';
import {scrapeDtLot} from './scrapeDtLot';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=030&ekTjCd=&ekTjNm=&kb=1&kj=9&km=1&kt=9999999&sc=21202&ta=21&tb=0&tj=0&tt=9999999&bknlistmodeflg=2&pc=30 */

const url = 'https://suumo.jp/ms/chuko/aichi/sc_nagoyashichikusa/nc_97454649/';
const data:IProperty = {

};

test(('getCompanyInfo'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await getCompanyInfo(page, data);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

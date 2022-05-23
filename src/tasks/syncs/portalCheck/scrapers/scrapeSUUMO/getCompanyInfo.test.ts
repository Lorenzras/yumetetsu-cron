import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {IProperty} from '../../types';
import {getCompanyInfo} from './getCompanyInfo';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=030&ekTjCd=&ekTjNm=&kb=1&kj=9&km=1&kt=9999999&sc=21202&ta=21&tb=0&tj=0&tt=9999999&bknlistmodeflg=2&pc=30 */
// こちらなし /* https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz198324093.html */

// 中古マンション用
const data: IProperty = {
  物件種別: '中古マンション',
  物件名: 'ライオンズマンション東山',
  物件番号: '97454649',
  所在地: '愛知県名古屋市千種区東山元町２',
  リンク: 'https://suumo.jp/ms/chuko/aichi/sc_nagoyashichikusa/nc_97454649/',
  販売価格: '1030万円',
  比較用価格: 1030,
};

/* const data: IProperty = {
  物件種別: '中古戸建',
  物件名: 'Asobi+　千種区竹越一丁目',
  物件番号: '198271927',
  所在地: '愛知県名古屋市千種区竹越１',
  リンク: 'https://suumo.jp/chukoikkodate/__JJ_JJ010FJ100_arz1050z2bsz1021z2ncz198271927.html',
  販売価格: '2980万円',
  比較用価格: 2980,
}; */

test(('getCompanyInfo'), async () => {
  const page = await openMockBrowserPage();
  const result = await getCompanyInfo(page, data);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

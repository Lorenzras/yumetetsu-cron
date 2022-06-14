import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {IProperty} from '../../types';
import {getContactLink, scrapeContact} from './scrapeContact';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=030&ekTjCd=&ekTjNm=&kb=1&kj=9&km=1&kt=9999999&sc=21202&ta=21&tb=0&tj=0&tt=9999999&bknlistmodeflg=2&pc=30 */
// こちらなし /* https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz198324093.html */

// 中古マンション用
// こちら有
const data: IProperty = {
  物件種別: '中古マンション',
  物件名: 'ライオンズマンション東山',
  物件番号: '97454649',
  所在地: '愛知県名古屋市千種区東山元町２',
  リンク: 'https://suumo.jp/ms/chuko/aichi/sc_nagoyashichikusa/nc_97454649/',
  販売価格: '1030万円',
  比較用価格: 1030,
};
// こちら無
/* const data: IProperty = {
  物件種別: '中古マンション',
  物件名: '野村三好ケ丘ヒルズ四番館',
  物件番号: '198324093',
  所在地: '愛知県みよし市三好丘５',
  リンク: 'https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz198324093.html',
  販売価格: '2080万円',
  比較用価格: 2080,
}; */

// 中古戸建用
/* const data: IProperty = {
  物件種別: '中古戸建',
  物件名: 'Asobi+ 千種区竹越一丁目',
  物件番号: '198271927',
  所在地: '愛知県名古屋市千種区竹越１',
  リンク: 'https://suumo.jp/chukoikkodate/__JJ_JJ010FJ100_arz1050z2bsz1021z2ncz198271927.html',
  販売価格: '2980万円',
  比較用価格: 2980,
}; */

describe('scrapecontact', () => {
  test(('main'), async () => {
    const page = await openMockBrowserPage();
    const result = await scrapeContact(page, data);

    expect(result).toMatchSnapshot();
    page.browser().disconnect();
  }, browserTimeOut);

  /* test comand:: jest scrapeSUUMO/scrapeContact -t link -u */
  test(('link'), async () => {
    const page = await openMockBrowserPage();
    const testLinks = [
      'https://suumo.jp/ms/chuko/aichi/sc_nagoyashichikusa/nc_97454649/',
      'https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz198324093.html',
      'https://suumo.jp/chukoikkodate/__JJ_JJ010FJ100_arz1050z2bsz1021z2ncz198271927.html',
      'https://gggg',
      'https://suumo.jp/tochi/__JJ_JJ010FJ100_arz1050z2bsz1030z2ncz197157686.html',
      'https://suumo.jp/tochi/__JJ_JJ010FJ100_arz1050z2bsz1030z2ncz196937454.html',
    ];

    const result = [];
    for (const link of testLinks) {
      result.push(await getContactLink(page, link));
    }

    expect(result).toMatchSnapshot();
    page.browser().disconnect();
  }, browserTimeOut);
});

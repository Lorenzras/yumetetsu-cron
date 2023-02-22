import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {compareData} from './compareData';

/**
 * テスト条件：
 *  - 物件検索ページにあり https://manage.do-network.com/estate
 *  - 検索を押した後
 *  */
test('compare', async () => {
  const page = await openMockBrowserPage();
  const result = await compareData(page, {
    '物件番号': 'homes-b-1426280000580',
    '所在地': '愛知県名古屋市昭和区広路本町1丁目',
    '比較用価格': 3190,
    '物件名': 'ルーフバルコニー付きメゾネットマンション 御器所サンハイツ',
    'リンク': 'https://www.homes.co.jp/mansion/b-1426280000580/',
    '販売価格': '3,190万円',
    '物件種別': '中古マンション',
    'DOステータス': '',
    'DO価格差': '',
    'DO検索結果件数': '',
    'DO物件番号': '',
    'DO登録価格': '',
    'DO管理有無': '無',
    '掲載企業': 'ハウスドゥ　東山公園駅前　株式会社GUTS',
    '掲載企業TEL': '0120-930-776',
  });
  console.log(result);
  page.browser().disconnect();
}, browserTimeOut);

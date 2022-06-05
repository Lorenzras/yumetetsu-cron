import {navigateToPropertyPage} from './../../../common/doNet/pages/navigate';
import {openBrowserPage} from './../../../common/browser/openBrowser';
import {selectByText, searchDoProperty} from './searchDoProperty';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {login} from '../../../common/doNet';

describe('form', ()=>{
  test('search', async () => {
    const page = await openBrowserPage({

    });

    /*     await login(page);
    // await navigateToPropertyPage(page);
    await Promise.all([
      page.waitForNavigation(),
      page.click('.sidebar-estate'),
    ]); */

    const result = (await searchDoProperty({
      logSuffix: '',
      page, inputData: {
        '物件番号': 'homes-b-1295000002399',
        '所在地': '愛知県高浜市沢渡町5丁目',
        '専有面積': '81.45m²',
        '比較用専有面積': 81.45,
        '比較用価格': 1480,
        '物件名': 'ラビデンス高浜ステーション',
        'リンク': 'https://www.homes.co.jp/mansion/b-1295000002399/',
        '販売価格': '1,480万円',
        'DOステータス': '',
        'DO価格差': '',
        'DO検索結果件数': '',
        'DO物件番号': '',
        'DO登録価格': '',
        'DO管理有無': '無',
        '物件種別': '中古マンション',
        '掲載企業': 'ハウスドゥ　高浜中央　株式会社夢のおてつだい',
        '掲載企業TEL': '0566-52-5200',
      }}))[0];

    // page.browser().disconnect();
    await page.browser().close();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);

  test('selectPref', async ()=>{
    // location modal must be open.
    const page = await openMockBrowserPage();
    await selectByText(page, '#select_pref_id', '岐阜県');
    page.browser().disconnect();
  });
});


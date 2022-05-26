import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {cityLists} from '../../config';
import {THandlePrepareForm, TProperty} from '../../types';

/**
 * 検索条件を設定する
 * @param page 対象の県の初期ページ
 * @param pref 対象の県
 * @param type 物件種別
 */
export const prepareForm: THandlePrepareForm = async (
  page: Page,
  pref: string,
  type: TProperty,
) => {
  // 対象の市のリストを準備する
  const cities = Object.keys(cityLists[pref]);

  // 物件種別によって、開くサイトアドレスを設定する
  let url = '';
  switch (type) {
    case '中古戸建':
      url = 'https://suumo.jp/chukoikkodate/';
      break;
    case '中古マンション':
      url = 'https://suumo.jp/ms/chuko/';
      break;
    case '土地':
      url = 'https://suumo.jp/tochi/';
      break;
  }
  url = pref === '愛知県' ? url + 'aichi/city/' : url + 'gifu/city/';

  await page.goto(url, {waitUntil: 'networkidle2'}); // 検索サイトへ移動する

  await page.evaluate(
    (cities: string[]) => { // 渡された変数を関数の引数にすれば、使用出来ます。
      cities
        .forEach((city) => { // 各都市
          // サイトはJQueryがあるので、それを利用します
          $(`input[name="sc"] ~ label:contains("${city}")`) // ラベルのセレクター
            .prev().attr('checked', 'checked'); // clickをラベルに発火させます。
        });
    },
    cities, // evaluate内のコードにcitiesにアクセスを与える
  );

  // 3日以内に更新されたものに絞り込み
  await page.click('#kki102');

  // 検索をクリックする
  logger.info('検索をクリックする');
  await Promise.all([
    page.click('.js-searchBtn'),
    page.waitForNavigation(),
  ]);

  // シンプル一覧表示をクリックする
  logger.info('シンプル一覧表示をクリックする');
  await Promise.all([
    page.click('.ui-icon--tabview'),
    page.waitForNavigation(),
  ]);

  // 100件ごとに表示する
  await Promise.all([
    page.evaluate(() => {
      $('#js-tabmenu1-pcChange').val('100');
      $('#js-tabmenu1-pcChange').trigger('change');
    }),
    page.waitForNavigation(),
  ]);
  return true;
};

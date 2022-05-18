import {Page} from 'puppeteer';
import {setTimeout} from 'timers';
import {logger} from '../../../../../utils';
import {scrapeDtApartment} from './scrapeDtApartment';

const sleep = async (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * 市毎のページを表示する
 * @param page 対象の県の初期ページ
 * @param cities 対象の県に含まれる検索対象の市の配列
 */
export const prepareForm = async (
  page: Page,
  cities: string[],
) => {
  // 対象の市にすべてチェックを入れる
/*   for (const city of cities) {
    console.log('City', city);
    await page.$x(`//label[contains(text(),"${city}")]`)
      .then(([cityLink]) => cityLink.click());
    await sleep(800);
  } */

  // page.evaluate(pageFunction[, ...args])という関数で、ブラウザ内にコードを実行出来ます。
  // pageFunction内のコードは隔離しているので、その外の変数などにアクセスはありません。
  // [,...args]に渡せば、アクセスが与えられます。

  await page.evaluate(
    (cities: string[])=>{ // 渡された変数を関数の引きすにすれば、使用出来ます。
      cities
        .forEach((city) => { // 各都市
          // サイトはJQueryがあるので、それを利用します
          $(`input[name="sc"] ~ label:contains("${city}")`) // ラベルのセレクター
            .trigger('click'); // clickをラベルに発火させます。
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
  logger.info('検索をクリックする');
  await Promise.all([
    page.click('.ui-icon--tabview'),
    page.waitForNavigation(),
  ]);

  // await sleep(3000);

  // 裏に上と一緒ですが、複数ページを同時に動かとき、以下は他ページの処理がブロックしません。
  await page.waitForTimeout(3000);
  // スクレイピング処理
};
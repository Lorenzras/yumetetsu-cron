import {Page} from 'puppeteer';
import {setTimeout} from 'timers';
import {scrapeDtApartment} from './scrapeDtApartment';

const sleep = async (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * 市毎のページを表示する
 * @param page 対象の県の初期ページ
 * @param cities 対象の県に含まれる検索対象の市の配列
 */
export const perCity = async (
  page: Page,
  cities: string[],
) => {
  // 対象の市にすべてチェックを入れる
  for (const city of cities) {
    console.log('City', city);
    await page.$x(`//label[contains(text(),"${city}")]`)
      .then(([cityLink]) => cityLink.click());
    await sleep(800);
  }

  // 3日以内に更新されたものに絞り込み
  await page.click('#kki102');

  // 検索をクリックする
  await Promise.all([
    page.click('.js-searchBtn'),
    page.waitForNavigation(),
  ]);

  // シンプル一覧表示をクリックする
  await Promise.all([
    page.click('.ui-icon--tabview'),
    page.waitForNavigation(),
  ]);
  await sleep(3000);

  // スクレイピング処理
};

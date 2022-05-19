import {Page} from 'puppeteer';
import {cityLists as location} from '../../config';
import {ScraperFn} from '../../types';
import {perCity} from './perCity';

const suumoURL = 'https://suumo.jp/ms/chuko/';

/**
 * スーモサイトのスクレイピング設定
 * citylistから抽出した県の検索ページを開き、市毎の検索処理に情報を受け渡す
 * @param page : ウェブページ
 */
export const scrapeSUUMO: ScraperFn = async (page: Page) => {
  // citylistのkey(県)毎に処理を繰り返す
  for (const [pref, cities] of Object.entries(location)) {
    console.log(pref, cities);
    const targetPref = pref === '愛知' ?
      suumoURL + 'aichi/city/' : suumoURL + 'gifu/city/';

    // 検索サイトへ移動する
    // メモ：networkidle2=最後に通信が発生してから500ms待つ
    await page.goto(targetPref, {waitUntil: 'networkidle2'});

    await perCity(page, cities); // 市毎の検索処理
  }
};

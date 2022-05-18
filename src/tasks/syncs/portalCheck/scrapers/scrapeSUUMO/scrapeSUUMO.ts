import {Page} from 'puppeteer';
import {cityLists as location} from '../../config';
import {prepareForm} from './prepareForm';

const suumoURL = 'https://suumo.jp/ms/chuko/';

/**
 * スーモサイトのスクレイピング設定
 * citylistから抽出した県の検索ページを開き、市毎の検索処理に情報を受け渡す
 * @param page : ウェブページ
 */
export const scrapeSUUMO = async (page: Page) => {
  // citylistのkey(県)毎に処理を繰り返す
  for (const [pref, cities] of Object.entries(location)) {
    console.log(pref, cities);
    const targetPref = pref === '愛知' ?
      suumoURL + 'aichi/city/' : suumoURL + 'gifu/city/';

    // 検索サイトへ移動する
    // メモ：networkidle2=最後に通信が発生してから500ms待つ
    await page.goto(targetPref, {waitUntil: 'networkidle2'});

    await prepareForm(page, cities); // 市毎の検索処理
  }
};

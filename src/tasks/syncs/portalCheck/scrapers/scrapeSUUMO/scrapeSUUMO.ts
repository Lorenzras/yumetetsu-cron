import {Page} from 'puppeteer';
import {cityLists as location} from '../../config';
import {ScraperFn} from '../../types';
import {perCity} from './perCity';

const suumoURL = 'https://suumo.jp/ms/chuko/tokai/';

/**
 * スーモサイトのスクレイピング設定
 * citylistから抽出した県の検索ページを開き、市毎の検索処理に情報を受け渡す
 * @param page : ウェブページ
 */
export const scrapeSUUMO: ScraperFn = async (page: Page) => {
  // citylistのkey(県)毎に処理を繰り返す
  let idx = 0;
  for (const [pref, cities] of Object.entries(location)) {
    console.log(pref, cities);

    // メモ：networkidle2=最後に通信が発生してから500ms待つ
    await page.goto(suumoURL, {waitUntil: 'networkidle2'});
    const targetPref = pref === '愛知' ? 'aichi' : 'gifu';

    // 県(prefecture)を選択する
    await Promise.all([
      page.click(`.areabox--${targetPref}`),
      page.waitForNavigation(),
    ]);

    await perCity(page, cities);
    idx += 1;
  }
};

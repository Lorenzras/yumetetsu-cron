import {Page} from 'puppeteer';
import {cityLists as location} from '../../config';
import {PropertyActions} from '../../types';
import {prepareForm} from './prepareForm';
import {scrapeDtApartment} from './scrapeDtApartment';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';
import {scrapeLoop} from './scrapeLoop';
import {searchClick} from './searchClick';

const propertyActions: PropertyActions = [
  {
    type: '中古戸建',
    url: 'https://suumo.jp/chukoikkodate/',
    handleScraper: scrapeDtHouse,
  },
  {
    type: '中古マンション',
    url: 'https://suumo.jp/ms/chuko/',
    handleScraper: scrapeDtApartment,
  },
  {
    type: '土地',
    url: 'https://suumo.jp/tochi/',
    handleScraper: scrapeDtLot,
  },
];

/**
 * スーモサイトのスクレイピング設定
 * 物件種別ごとに、citylistから抽出した県の検索ページを開き、
 * 市毎の検索処理に情報を受け渡す
 * @param page : ウェブページ
 */
export const scrapeSUUMO = async (page: Page) => {
  // 物件種別ごとに処理を繰り返す
  for (const actions of propertyActions) {
    // citylistのkey(県)毎に処理を繰り返す
    for (const [pref, cityInfo] of Object.entries(location)) {
      const cities = Object.keys(cityInfo); // 県ごとに市の配列を作成する

      const targetPref = pref === '愛知' ?
        actions.url + 'aichi/city/' : actions.url + 'gifu/city/';

      // 検索サイトへ移動する
      // メモ：networkidle2=最後に通信が発生してから500ms待つ
      await page.goto(targetPref, {waitUntil: 'networkidle2'});

      await prepareForm(page, cities); // 検索条件を選択する
      await searchClick(page); // 検索ボタンを押す
      const result = await scrapeLoop(page, actions.handleScraper); // スクレイピング処理
    }
  }
};

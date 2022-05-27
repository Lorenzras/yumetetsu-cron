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
  console.log('市リストの確認', cities);
  // 物件種別によって、開くサイトアドレスを設定する
  let url = '';
  switch (type) {
    case '中古戸建':
      url = 'https://realestate.yahoo.co.jp/used/house/';
      break;
    case '中古マンション':
      url = 'https://realestate.yahoo.co.jp/used/mansion/';
      break;
    case '土地':
      url = 'https://realestate.yahoo.co.jp/land/';
      break;
  }
  url = pref === '愛知県' ? url + '05/23/city/' : url + '05/21/city/';
  await page.goto(url, {waitUntil: 'networkidle2'}); // 検索サイトへ移動する
  logger.info(`urlの確認 ${url}`); // ページ遷移を確認済

  // 対象の市を選択する
  logger.info('対象の市を選択する');
  for (const city of cities) {
    console.log('市の確認', city);
    const cityChkBox = await page.$x(`//a[contains(text(), ${city})]
      /parent::span/preceding-sibling::input`);
    // //a[contains(text(), ${city})]/../preceding-sibling::input でも可
    // //a[contains(text(), ${city})]/../../input でも可

    // await cityChkBox[0].["checked"]= 'true' // 構文エラー

    // .then(([item]) => item);
    await cityChkBox[0].click(); // これだとできない

    /* // ラジオボタンをチェックする方法例
$x('//*[@id="your_checkbox"]')[0]["checked"]= 'true' */
  }

  // 3日以内に更新されたものに絞り込み NG
  const spanBtn = await page.$x('//input[@id="_info_open3"]');
  console.log('item', spanBtn);
  await spanBtn[0].click(); // おそらくここがNG

  // 検索をクリックする OK
  logger.info('検索をクリックする');
  await Promise.all([
    page.click('.SearchButtonBox__btnMove'),
    page.waitForNavigation(),
  ]);

  return true;
};

export const searchYahoo = async (page: Page) => {
  // 3日以内に更新されたものに絞り込み
  /* const spanBtn = await page.$x('//input[@id="_info_open3"]');
  console.log('item', spanBtn);
  await spanBtn[0].click(); */ // NG:spanBtnは取得できてるっぽい。clickがダメ？？checkedはない

  // await page.click('#_info_open3'); // これだとできない。clickがダメ？？
};

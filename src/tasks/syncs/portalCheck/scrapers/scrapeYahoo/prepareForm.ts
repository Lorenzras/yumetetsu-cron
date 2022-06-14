import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {THandlePrepareForm, TProperty} from '../../types';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';
import {chunkLengs, splitCities} from './splitHelper';

// 物件種別によって、開くサイトアドレスを設定する
const getUrl = (type: TProperty) => {
  switch (type) {
    case '中古戸建':
      return 'https://realestate.yahoo.co.jp/used/house/';
    case '中古マンション':
      return 'https://realestate.yahoo.co.jp/used/mansion/';
    case '土地':
      return 'https://realestate.yahoo.co.jp/land/';
    default:
      return 'about:blank';
  }
};

/**
 * サイトで対象の市(複数)を選択し、検索する
 * @param page 対象の県の初期ページ
 * @param pref 対象の県
 * @param type 物件種別
 * @param nextIdx 処理した回数
 * @returns {boolean} 処理完了/中断
 */
export const prepareForm: THandlePrepareForm = async (
  page,
  pref,
  type,
  nextIdx = 0,
) => {
  try {
    // 対象の市のリストを準備する
    const cities = splitCities(pref, nextIdx);
    // console.log('市リストの確認', cities);

    // 対象のサイトを開く
    let url = getUrl(type);
    url = pref === '愛知県' ? url + '05/23/city/' : url + '05/21/city/';
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    logger.info(`urlの確認 ${url}`);

    // 対象の市を選択する(XPath)
    logger.info('対象の市を選択する');
    for (const city of cities) {
      const newCity = city.replace('名古屋市', '');
      // console.log('市の確認', newCity);
      const [cityChkBox] = await page.$x(`//span[a
      [contains(text(), "${newCity}")]]/preceding-sibling::input`);

      // サイトの構成上、puppeteerのクリックが使えないため、evaluateを使用する
      await page.evaluate((cityChkBox: HTMLInputElement) => {
        cityChkBox?.click();
      }, cityChkBox);
    }

    // 3日以内をクリックする(css)
    await page.click('label[for="_info_open3"]');
    /* await page.$eval('#_info_open3', (el) => {
      (el as HTMLInputElement).click();
    }); */

    await page.waitForNetworkIdle();
    // 3日以内をクリックする(XPath)
    /*   const [spanBtn] = await page.$x('//input[@id="_info_open3"]');
    // サイトの構成上、puppeteerのクリックが使えないため、evaluateを使用する
    await page.evaluate((spanBtn: HTMLInputElement)=>{
      spanBtn.click();
    }, spanBtn); */
    // 3日以内をクリックする(js?)
    /*     const radio = document.querySelector('#_info_open3');
        (radio as HTMLInputElement)?.click(); */

    await page.waitForSelector('.FixedBtnBox__inner', {visible: true});

    //
    const isdisabled = await Promise.race([
      page.waitForSelector('.FixedBtnBox__btnWrp__btnMove--disabled'
        , {visible: true}).then(() => true),
      page.waitForSelector('.FixedBtnBox__btnWrp__btnMove'
        , {visible: true}).then(() => false),
    ]);

    console.log('isdisabled::', isdisabled);


    if (isdisabled) {
      return {
        success: false,
        chunkLength: chunkLengs(pref),
        nextIdx: nextIdx + 1,
      };
    }

    // 検索をクリックする
    await page.waitForNetworkIdle();
    await Promise.all([
      page.waitForNavigation(),
      page.click('#_FixedSearchButton'),
    ]);
    /*     await page.$eval('#_FixedSearchButton', (el) => {
      (el as HTMLAnchorElement).click();
    }); */

    /* エラーページなら、待たずに次の処理に行く。
    わざとスローもさせるか様子見る */
    await Promise.race([
      page.waitForSelector('#_ResultCountDisplay'),
      page.waitForSelector('#usedListBox .error'),
    ]);

    /* logger.info('検索をクリックする');
    await Promise.all([
      page.click('#_FixedSearchButton'),
      page.waitForNavigation(),
    ]); */
  } catch (error: any) {
    await logErrorScreenshot(page,
      `Yahoo検索ページの設定に失敗しました。${page.url()} ${error.message}`);
    return {
      success: false,
      chunkLength: chunkLengs(pref),
      nextIdx: nextIdx + 1,
    };
  }

  return {
    success: true,
    chunkLength: chunkLengs(pref),
    nextIdx: nextIdx + 1,
  };
};


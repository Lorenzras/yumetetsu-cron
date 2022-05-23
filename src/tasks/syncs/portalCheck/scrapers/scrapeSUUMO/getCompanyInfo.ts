// こちらなし /* https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz198324093.html */

import {Page} from 'puppeteer';
import {IProperty} from '../../types';

export const getCompanyInfo = async (
  page: Page,
  data: IProperty,
) => {
  // 物件詳細ページを表示する
  await Promise.all([
    page.goto(data.リンク, {waitUntil: 'networkidle2'}),
    page.waitForNavigation(),
  ]);

  await page.evaluate((el) => {
    // マンションのみ、「所在階/構造・階建」を取得し、物件名に追加する
    if (data.物件種別 === '中古マンション') {
      data.物件名 = data.物件名 + ' ' + $(el).find('th:contains(所在階) ~ td')
        .eq(0).text().trim().split('/', 1)[0];
    }

    // 「こちら」のリンクの有無を確認する

    // 掲載企業名を取得する

    // 掲載企業の連絡先を取得する
    /*   const companyDates = {};

      return companyDates;
    }; */
  });
  return '仮';
};


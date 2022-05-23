// こちらなし /* https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz198324093.html */

import {Page} from 'puppeteer';

export const getCompanyInfo = async (page:Page, url:string) => {
  // 物件詳細ページを表示する
  await Promise.all([
    page.goto(url, {waitUntil: 'networkidle2'}),
    page.waitForNavigation(),
  ]);

  // 「こちら」のリンクの有無を確認する

  // 掲載企業名を取得する

  // 掲載企業の連絡先を取得する

  const companyDates = {};

  return companyDates;
};

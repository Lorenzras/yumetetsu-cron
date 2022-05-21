import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';

export const searchClick = async (page:Page) => {
  // 検索をクリックする
  logger.info('検索をクリックする');
  await Promise.all([
    page.click('.js-searchBtn'),
    page.waitForNavigation(),
  ]);

  // シンプル一覧表示をクリックする
  logger.info('シンプル一覧表示をクリックする');
  await Promise.all([
    page.click('.ui-icon--tabview'),
    page.waitForNavigation(),
  ]);

  // 裏に上と一緒ですが、複数ページを同時に動かすとき、以下は他ページの処理がブロックしません。
  await page.waitForTimeout(3000);
};

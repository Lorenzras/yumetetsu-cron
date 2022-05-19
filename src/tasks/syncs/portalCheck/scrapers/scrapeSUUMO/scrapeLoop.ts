import {Page} from 'puppeteer';
import {IHouse} from '../../types';
import {scrapeDtHouse} from './scrapeDtHouse';

export const scrapeLoop = async (page: Page) => {
  let result: IHouse[] | [] = [];

  /* const nextButton = await page.$$eval('.pagination-parts', (list) =>{
    return list.filter((item) => $(item).text() === '次へ').length;
  } ); */
  let nextButton;

  // 次へボタンの存在を確認する
  do {
    nextButton = await page.$x(`//a[contains(text(), "次へ")]`)
      .then(([next]) => next);
    result = [...result, ...await scrapeDtHouse(page)];
    // 次へをクリックする
    if (nextButton) {
      await Promise.all([
        nextButton.click(),
        page.waitForNavigation({waitUntil: 'networkidle2'}),
      ]);
    }
  } while (nextButton);

  console.log(result.length);
  return result;
};

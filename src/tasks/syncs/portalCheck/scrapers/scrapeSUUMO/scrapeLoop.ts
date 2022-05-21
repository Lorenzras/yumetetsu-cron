import {Page} from 'puppeteer';
import {IProperty} from '../../types';

export const scrapeLoop =
async (page: Page, func:(page: Page) => Promise<IProperty[]>) => {
  let result: IProperty[] | [] = [];

  /* const nextButton = await page.$$eval('.pagination-parts', (list) =>{
    return list.filter((item) => $(item).text() === '次へ').length;
  } ); */
  let nextButton;

  // 次へボタンの存在を確認する
  do {
    nextButton = await page.$x(`//a[contains(text(), "次へ")]`)
      .then(([next]) => next);
    result = [...result, ...await func(page)];
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

import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {IProperty} from '../../types';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';

export const scrapeLoop =
  async (page: Page, func: (page: Page) => Promise<IProperty[]>) => {
    let result: IProperty[] | [] = [];

    /* const nextButton = await page.$$eval('.pagination-parts', (list) =>{
      return list.filter((item) => $(item).text() === '次へ').length;
    } ); */
    let nextButton;

    // 次へボタンの存在を確認する
    try {
      do {
        nextButton = await page.$x(`//a[contains(text(), "次へ")]`)
          .then(([next]) => next);
        result = [...result, ...await func(page)];
        logger.info(`Scraped ${result.length} items. ${page.url()}`);
        // 次へをクリックする
        if (nextButton) {
          logger.info(`Clicking next at ${page.url()}`);
          await Promise.all([
            nextButton.click(),
            page.waitForNavigation({waitUntil: 'domcontentloaded'})
              .catch(()=> {
                throw new Error('Failed to navigated after clicking next.');
              }),
          ]);
          logger.info(`Succesfully clicked next at ${page.url()}`);
        }
      } while (nextButton);

      return result;
    } catch (error: any) {
      await logErrorScreenshot(page,
        `次のページへの遷移に失敗しました。${page.url()} ${error.message}`);
      return result;
    }
  };

import {load} from 'cheerio';
import {Page} from 'puppeteer';
import {getTextByXPath, logger} from '../../../../../utils';
import {IHouse} from '../../types';
import {logErrorScreenshot} from '../helpers/logErrorScreenshot';
import {webScraper} from '../helpers/webScraper';
import {getDataEndpoint} from './helpers/getDataEndpoint';

export const scrapeDtHousePage = async (
  page: Page,
): Promise<IHouse[] | []> => {
  try {
    // PRは除く
    const htmlBody = await page.content();

    const $ = load(htmlBody);
    const els = $('.ListBukken__list__item:not(._devListBoxWrap)').toArray();

    // const datas = Promise.all(
    return els.map<IHouse>((el) => {
      const title = $(el).find('.ListCassette__title__text--single')
        .text().trim();
      const url = $(el).find('button').attr('data-dtlurl') ?? '';
      const rawPrice = $(el).find(':contains(価格)').next('dd').text().trim();
      const address = $(el).find(':contains(所在地)').next('dd').text().trim();
      const rawArea = $(el).find(':contains(土地面積)').next('dd').text().trim();

      return {
        物件種別: '中古戸建',
        物件番号: 'yahoo-' + url.split('/').at(-2),
        物件名: title,
        リンク: url,
        所在地: address,
        販売価格: rawPrice,
        比較用価格: 0,
        土地面積: rawArea,
        比較用土地面積: 0,
      };
    },
    );
  } catch (error: any) {
    await logErrorScreenshot(page,
      `Yahoo中古戸建のスクレイピングに失敗しました。${page.url()} ${error.message}`);
    return ([{
      物件種別: '中古戸建',
      物件番号: '取得失敗',
      物件名: '取得失敗',
      リンク: '取得失敗',
      所在地: '取得失敗',
      販売価格: '取得失敗',
      比較用価格: 0,
      土地面積: '取得失敗',
      比較用土地面積: 0,
    }]);
  }
};

const handleNextPage = async (page: Page) => {
  const hasNextPage = await page.$eval('[data-has_next_page]', (el) => {
    return JSON.parse((el as HTMLElement).dataset.has_next_page ?? 'false');
  });

  if (hasNextPage) {
    const rawPage = page.url().split('&')?.at(-1) ?? '';
    const nextPageNum = +(rawPage?.split('=').at(-1) ?? 0) + 1;

    await page.goto(page.url().replace(rawPage, `page=${nextPageNum}`));
  }

  return hasNextPage;
};

export const scrapeDtHouse = async (
  page: Page,

): Promise<IHouse[]> => {
  logger.info(`Scraping ${page.url()}. `);

  const dataEndpoint = getDataEndpoint(page.url());

  await page.goto(dataEndpoint);

  return await webScraper<IHouse>({
    page,
    handleScraper: scrapeDtHousePage,
    handleNextPage: handleNextPage,
  });
};

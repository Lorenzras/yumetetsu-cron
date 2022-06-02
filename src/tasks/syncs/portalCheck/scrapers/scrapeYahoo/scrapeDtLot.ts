/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {ILot} from '../../types';
import {webScraper} from './../helpers/webScraper';
import {getDataEndpoint} from './helpers/getDataEndpoint';
import {load} from 'cheerio';
import {handleNextPage} from './helpers/handleNextPage';

export const scrapeDtLotPage = async (page: Page) => {
  const htmlBody = await page.content();

  const $ = load(htmlBody);
  const els = $('.ListBukken__list__item:not(._devListBoxWrap)').toArray();
  return els.map<ILot>((el) => {
    const propName = $(el).find('.__title__ h2').text().trim();
    const link = $(el).find('button').attr('data-dtlurl') ?? '';
    const address = $(el).find(':contains(所在地)').next('dd').text().trim();
    const price = $(el).find(':contains(価格)').next('dd').text().trim();
    const lotArea = $(el).find(':contains(土地面積)').next('dd').text().trim();
    return {
      リンク: link,
      土地面積: lotArea,
      所在地: address,
      比較用価格: 0,
      比較用土地面積: 0,
      物件名: propName,
      販売価格: price,
      物件番号: 'yahoo-' + link.split('/').at(-2),
    };
  },
  );
};


export const scrapeDtLot = async (
  page: Page,

): Promise<ILot[]> => {
  logger.info(`Scraping ${page.url()}. `);

  const dataEndpoint = getDataEndpoint(page.url());

  await page.goto(dataEndpoint);

  return await webScraper<ILot>({
    page,
    handleScraper: scrapeDtLotPage,
    handleNextPage: handleNextPage,
  });
};

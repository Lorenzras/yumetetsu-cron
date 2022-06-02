/* eslint-disable max-len */
import {ElementHandle, Page} from 'puppeteer';
import {logger, getTextByXPath} from '../../../../../utils';
import {ILot} from '../../types';
import {webScraper} from './../helpers/webScraper';
import {getDataEndpoint} from './helpers/getDataEndpoint';
import axios from 'axios';
import {load} from 'cheerio';

export const scrapeDtLotPage = async (page: Page) => {
  const htmlBody = await page.content();

  /* const htmlBody = await axios.get('https://realestate.yahoo.co.jp/used/house/search/partials/?bk=5&min_st=99&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf=23&grp=231&page=1')
    .then((res)=>res.data); */

  const $ = load(htmlBody);
  const els = $('.ListBukken__list__item:not(._devListBoxWrap)').toArray();
  return els.map<ILot>((el) => {
    const propName = $(el).find('.__title__ h2').text().trim();
    const link = $(el).find('button').attr('data-dtlurl') ?? '';
    const address = $(el).find(':contains(所在地)').next('dd').text().trim();
    const price = $(el).find(':contains(価格)').next('dd').text().trim();

    return {
      リンク: link,
      土地面積: 'lotArea',
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

/* eslint-disable max-len */
import {ElementHandle, Page} from 'puppeteer';
import {logger, getTextByXPath} from '../../../../../utils';
import {ILot} from '../../types';
import {webScraper} from './../helpers/webScraper';
import {getDataEndpoint} from './helpers/getDataEndpoint';


export const scrapeDtLotPage = async (page: Page) => {
  // PR 物件以外
  const els = (await page.$$('.ListBukken__list__item:not(._devListBoxWrap)'));
  const data = Promise.all(
    els.map<Promise<ILot>>(async (el)=>{
      const getXPath = (dtName: string) => `//dt[contains(text(), "${dtName}")]/following-sibling::dd`;
      const propName = await el.$eval('.__title__ h2',
        (ch) => (ch as HTMLHeadElement).innerText);
      const link = await el.$eval('button',
        (ch) => ch.getAttribute('data-dtlurl') ?? '');

      const address = await getTextByXPath(page, getXPath('所在地'), el );
      const lotArea = await getTextByXPath(page, getXPath('土地面積'), el );
      const price = await getTextByXPath(page, getXPath('価格'), el );

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
    }),
  );


  return data ?? [];
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

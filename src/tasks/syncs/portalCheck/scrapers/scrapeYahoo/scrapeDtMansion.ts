/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {IMansion} from '../../types';
import {webScraper} from '../../helpers/webScraper';
import {getDataEndpoint} from './helpers/getDataEndpoint';
import {load} from 'cheerio';
import {handleNextPage} from './helpers/handleNextPage';

export const scrapeDtMansionPage = async (page: Page) => {
  const htmlBody = await page.content();

  const $ = load(htmlBody);
  const els = $('.ListBukken__list__item:not(._devListBoxWrap)').toArray();
  return els.map<IMansion[]>((el) => {
    const propName = $(el).find('.ListCassette__title h2').eq(0).text().trim();


    const address = $(el).find(':contains(所在地)').next('dd').text().trim();

    const propList = $(el)
      .find('ul.ListBukken__innerList li.ListBukken__innerList__item')
      .map((_, unit)=> {
        const link = $(unit).find('button').attr('data-dtlurl') ?? '';
        const unitName = $(unit).find('.ListCassette__title h2').text().trim();
        const price = $(unit).find(':contains(価格)').next('dd').text().trim();
        const area = $(unit).find(':contains(専有面積)')
          .next('dd').text().trim();


        return {
          リンク: link,
          専有面積: area,
          所在地: address,
          比較用価格: 0,
          比較用専有面積: 0,
          物件名: `${propName} ${unitName}`,
          販売価格: price,
          物件番号: 'yahoo-' + link.split('/').at(-2),
        };
      });

    return [...propList];
  },
  ).flat();
};

export const scrapeDtMansion = async (
  page: Page,

): Promise<IMansion[]> => {
  logger.info(`Scraping ${page.url()}. `);

  const dataEndpoint = getDataEndpoint(page.url());

  await page.goto(dataEndpoint);

  const result = await webScraper<IMansion>({
    page,
    handleScraper: scrapeDtMansionPage,
    handleNextPage: handleNextPage,
  });

  const key = '物件番号';

  const arrayUniqueByKey = [...new Map(result.map((item) =>
    [item[key], item])).values()];

  return arrayUniqueByKey;
};

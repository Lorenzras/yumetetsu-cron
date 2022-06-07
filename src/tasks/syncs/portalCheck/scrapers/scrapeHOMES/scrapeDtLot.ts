import {Page} from 'puppeteer';
import {extractNumber, extractPrice, logger} from '../../../../../utils';
import {ILot} from '../../types';
import {webScraper} from '../../helpers/webScraper';
import {handleNextPage} from './handleNextPage';

export const scrapeDtLotPage = async (page: Page) => {
  try {
    const data = await page.$$eval('.mod-mergeBuilding--sale', (els) => {
      return els.map<ILot>((el) => {
        const rawPrice = $(el)
          .find('.priceLabel').text();

        const address = $(el)
          .find('.bukkenSpec .verticalTable th:contains(所在地) ~ td')
          .html().split('<br>').at(-1)?.trim() || '';

        const propUrl: string = $(el).find('.prg-bukkenNameAnchor')
          .prop('href');

        let areas = '';
        /* Some properties have their details
        listed at the bottom of the card */
        const unitSummary = $(el).find('.unitSummary');

        if (unitSummary.length) {
          areas = unitSummary.find('tbody tr:first td.space:first')
            .text();
        } else {
          areas = $(el)
            .find('th:contains(土地面積)')
            .siblings('td:first').text()
            .trim();
        }


        return {
          物件番号: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          物件名: $(el).find('.bukkenName').text(),
          販売価格: rawPrice,
          比較用価格: 0,
          所在地: address,
          比較用土地面積: 0,
          土地面積: areas,
          リンク: propUrl,
        };
      });
    });

    logger.info(`Scraped lot page ${data.length}`);

    return data;
  } catch (err: any) {
    logger.error(`HOMES scrapeDtLotPage ${err.message}`);
    throw new Error(err);
  }
};


export const scrapeDtLot = async (
  page: Page,

): Promise<ILot[]> => {
  logger.info(`Scraping ${page.url()}. `);


  return await webScraper<ILot>({
    page,
    handleScraper: scrapeDtLotPage,
    handleNextPage: handleNextPage,
  });
};

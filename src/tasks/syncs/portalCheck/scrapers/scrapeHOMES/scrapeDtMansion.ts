import {IMansion} from '../../types';
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {webScraper} from '../helpers/webScraper';
import {handleNextPage} from './handleNextPage';

export const scrapeDtMansionPage = async (page: Page) => {
  return await page.$$eval('.mod-mergeBuilding--sale', (els) => {
    return els.reduce((curr, el)=>{
      const address = $(el)
        .find('.bukkenSpec .verticalTable td')
        .first().html().split('<br>').at(-1) || '';
      const propertyName = $(el)
        .find('.bukkenName')
        .text().trim();

      const units = $(el).find('.raSpecRow').toArray();

      const mansions: IMansion[] = units.map((unit) => {
        const rawFloorArea = $(unit)
          .find('.layoutSpace').text().split('/').at(-1) || '';
        const propUrl = $(unit).find('.detail a').attr('href') || '';

        return {
          物件番号: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          所在地: address,
          専有面積: rawFloorArea,
          比較用専有面積: 0,
          比較用価格: 0,
          物件名: propertyName,
          リンク: propUrl,
          販売価格: $(unit).find('.priceLabel').text(),
        };
      });


      return [...curr, ...mansions];
    }, [] as IMansion[]);
  });
};


export const scrapeDtMansion = async (
  page: Page,

): Promise<IMansion[]> => {
  logger.info(`Scraping ${page.url()}. `);

  return await webScraper<IMansion>({
    page,
    handleScraper: scrapeDtMansionPage,
    handleNextPage: handleNextPage,
  });
};

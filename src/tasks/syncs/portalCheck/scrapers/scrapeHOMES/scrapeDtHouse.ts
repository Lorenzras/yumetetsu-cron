import {logger} from './../../../../../utils/logger';
import {Page} from 'puppeteer';
import {IHouse} from '../../types';
import {webScraper} from '../../helpers/webScraper';
import {handleNextPage} from './handleNextPage';

export const scrapeDtHousePage = async (page: Page) => {
  return await page.$$eval(
    '.mod-mergeBuilding--sale',
    (els) => {
      const currDateTime = new Date().toISOString()
        .replace(/:\d+.\d+Z$/g, '').replace('T', ' ');

      return els.map<IHouse>((el) => {
        const [lotArea] = $(el)
          .find('td.space').html().split('<br>', 2);

        const propUrl: string = $(el).find('.prg-bukkenNameAnchor')
          .prop('href');

        const location = $(el).find('.bukkenSpec td')
          .first().html().split('<br>');

        const rawPrice = $(el).find('.priceLabel').text();

        return {
          物件番号: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          取得した日時: currDateTime,
          物件名: $(el).find('.bukkenName').text(),
          販売価格: rawPrice,
          比較用価格: 0,
          リンク: propUrl,
          土地面積: lotArea,
          比較用土地面積: 0,
          所在地: location[location.length - 1],
        };
      });
    },
  );
};


export const scrapeDtHouse = async (
  page: Page,

): Promise<IHouse[]> => {
  logger.info(`Scraping ${page.url()}. `);


  return await webScraper<IHouse>({
    page,
    handleScraper: scrapeDtHousePage,
    handleNextPage: handleNextPage,
  });
};

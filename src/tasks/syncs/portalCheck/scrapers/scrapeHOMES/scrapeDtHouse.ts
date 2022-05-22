import {logger} from './../../../../../utils/logger';
import {Page} from 'puppeteer';
import {extractNumber, extractPrice} from '../../../../../utils';
import {IHouse} from '../../types';

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
  result?: IHouse[] | [],
) : Promise<IHouse[]> => {
  logger.info(`Scraping kodate. `);
  const data = await scrapeDtHousePage(page);

  logger.info(`Scraped page ${data.length} `);

  const populateNumbers = data
    .map<IHouse>(((item)=>({
    ...item,
    比較用価格: extractPrice(item.販売価格),
    比較用土地面積: extractNumber(item.土地面積),
  })));

  const cummulativeResult = [...(result ?? []), ...populateNumbers];

  logger.info(`Scraped kodate cumm ${cummulativeResult.length} `);

  if (await page.$('.nextPage')) {
    logger.info('Clicking next page.');
    await Promise.all([
      page.waitForNavigation(),
      page.click('.nextPage'),
    ]);


    return await scrapeDtHouse(page, cummulativeResult);
  }

  logger.info('Done scraping kodate');
  return cummulativeResult;
};

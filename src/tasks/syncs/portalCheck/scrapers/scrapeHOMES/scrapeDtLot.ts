import {Page} from 'puppeteer';
import {extractNumber, extractPrice, logger} from '../../../../../utils';
import {ILot} from '../../types';

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

        let areas: string[] = [];
        /* Some properties have their details
        listed at the bottom of the card */
        const unitSummary = $(el).find('.unitSummary');

        if (unitSummary.length) {
          areas[0] = unitSummary.find('tbody td.space:first')
            .text().replaceAll('m²', '');
        } else {
          areas = $(el)
            .find('th:contains(土地面積)')
            .siblings('td:first').text()
            .trim().replaceAll('m²', '').split('〜', 2);
        }


        const [rawLotArea] = areas;
        return {
          物件番号: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          物件名: $(el).find('.bukkenName').text(),
          販売価格: rawPrice,
          比較用価格: 0,
          所在地: address,
          比較用土地面積: 0,
          土地面積: rawLotArea,
          リンク: propUrl,
        };
      });
    });

    logger.info(`Scraped lot page ${data.length}`);

    return data
      .map(((item)=>{
        return ({
          ...item,
          比較用価格: extractPrice(item.販売価格.split('円')[0]),
          比較用土地面積: extractNumber(item.土地面積),
        });
      }));
  } catch (err: any) {
    logger.error(`HOMES scrapeDtLotPage ${err.message}`);
    throw new Error(err);
  }
};

export const scrapeDtLot = async (
  page: Page,
  result?: ILot[],
) : Promise<ILot[]> => {
  try {
    const data = await scrapeDtLotPage(page);

    const cummulativeResult = [...(result ?? []), ...data];

    if (await page.$('.nextPage')) {
      logger.info(`Scrape Lot => Clicking nextPage ${page.url()}`);

      await Promise.all([
        page.waitForNavigation(),
        page.evaluate(()=>{
          $('.nextPage a')[0].click(); // force click next
        }),
      ]);
      logger.info(`Scrape Lot => Goto nextPage success. `);
      return await scrapeDtLot(page, cummulativeResult);
    }

    logger.info(`Done scraping lot ${cummulativeResult.length}`);
    return cummulativeResult;
  } catch (err: any) {
    logger.error(`HOMES scrapeDtLot ${err.message}`);
    throw new Error(err);
  }
};

import {IMansion} from '../../types';
import {Page} from 'puppeteer';
import {extractNumber, extractPrice, logger} from '../../../../../utils';

export const scrapeDtMansion = async (
  page: Page,
  result?: IMansion[],
): Promise<IMansion[]> => {
  const data = await page.$$eval('.mod-mergeBuilding--sale', (els) => {
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

  const populateNumbers = data
    .map(((item)=>({
      ...item,
      比較用価格: extractPrice(item.販売価格),
      比較用専有面積: extractNumber(item.専有面積),
    })));

  const cummulativeResult = [...(result ?? []), ...populateNumbers];

  if (await page.$('.nextPage')) {
    await Promise.all([
      page.click('.nextPage'),
      page.waitForNavigation(),
    ]);
    return await scrapeDtMansion(page, cummulativeResult);
  }

  logger.info('Done scraping mansion');
  return cummulativeResult;
};

import {IMansion} from '../../types';
import {Page} from 'puppeteer';
import {extractNumber, extractPrice} from '../../../../../utils';

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
          id: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          address: address,
          rawFloorArea: rawFloorArea,
          floorArea: 0,
          price: 0,
          propertyName: propertyName,
          propertyUrl: propUrl,
          rawPrice: $(unit).find('.priceLabel').text(),
        };
      });


      return [...curr, ...mansions];
    }, [] as IMansion[]);
  });

  const populateNumbers = data
    .map(((item)=>({
      ...item,
      price: extractPrice(item.rawPrice),
      floorArea: extractNumber(item.rawFloorArea),
    })));

  const cummulativeResult = [...(result ?? []), ...populateNumbers];

  if (await page.$('.nextPage')) {
    await Promise.all([
      page.click('.nextPage'),
      page.waitForNavigation(),
    ]);
    return await scrapeDtMansion(page, cummulativeResult);
  }

  return cummulativeResult;
};

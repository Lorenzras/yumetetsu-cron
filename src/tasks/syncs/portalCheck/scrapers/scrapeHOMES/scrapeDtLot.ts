import {Page} from 'puppeteer';
import {extractNumber, extractPrice} from '../../../../../utils';
import {ILot} from '../../types';

export const scrapeDtLot = async (
  page: Page,
  result?: ILot[],
) : Promise<ILot[]> => {
  const data = await page.$$eval('.mod-mergeBuilding--sale', (els) => {
    return els.map<ILot>((el) => {
      const [rawPrice] = $(el)
        .find('.priceLabel').text().split('〜', 2);

      const location = $(el).find('.bukkenSpec .verticalTable td')
        .first().html().split('<br>');

      console.log(location.at(-1));
      const propUrl: string = $(el).find('.prg-bukkenNameAnchor')
        .prop('href');

      let areas: string[] = []; // will store lot area and floor area
      /* Some properties have their details listed at the bottom of the card */
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
        id: 'homes-' + propUrl.split('/')
          .reduce((accu, curr) => curr ? curr : accu),
        propertyName: $(el).find('.bukkenName').text(),
        rawPrice: rawPrice,
        price: 0,
        address: location.at(-1)?.trim() || '',
        lotArea: 0,
        rawLotArea: rawLotArea,
        propertyUrl: propUrl,
      };
    });
  });

  const populateNumbers = data
    .map(((item)=>({
      ...item,
      price: extractPrice(item.rawPrice),
      lotArea: extractNumber(item.rawLotArea),
    })));


  const cummulativeResult = [...(result ?? []), ...populateNumbers];

  if (await page.$('.nextPage')) {
    await Promise.all([
      page.click('.nextPage'),
      page.waitForNavigation(),
    ]);
    return await scrapeDtLot(page, cummulativeResult);
  }

  return cummulativeResult;
};

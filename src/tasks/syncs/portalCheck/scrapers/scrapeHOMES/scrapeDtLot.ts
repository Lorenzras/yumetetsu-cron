import {Page} from 'puppeteer';
import {extractNumber, extractPrice} from '../../../../../utils';
import {ILot} from '../../types';

export const scrapePage = async (page: Page) => {
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
        address: address,
        lotArea: 0,
        rawLotArea: rawLotArea,
        propertyUrl: propUrl,
      };
    });
  });

  return data
    .map(((item)=>{
      console.log(item.rawPrice);
      return ({
        ...item,
        price: extractPrice(item.rawPrice.split('円')[0]),
        lotArea: extractNumber(item.rawLotArea),
      });
    }));
};

export const scrapeDtLot = async (
  page: Page,
  result?: ILot[],
) : Promise<ILot[]> => {
  const data = await scrapePage(page);

  const cummulativeResult = [...(result ?? []), ...data];

  if (await page.$('.nextPage')) {
    await Promise.all([
      page.click('.nextPage'),
      page.waitForNavigation(),
    ]);
    return await scrapeDtLot(page, cummulativeResult);
  }

  return cummulativeResult;
};

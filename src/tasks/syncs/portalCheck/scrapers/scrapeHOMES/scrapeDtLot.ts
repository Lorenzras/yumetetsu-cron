import {Page} from 'puppeteer';
import {ILot} from '../../types';

export const scrapeDtLot = async (
  page: Page,
  result?: ILot[],
) : Promise<ILot[]> => {
  const data = await page.$$eval('.mod-mergeBuilding--sale', (els) => {
    return els.map<ILot>((el) => {
      const [price, priceMax] = $(el)
        .find('.priceLabel').text().split('〜', 2);

      const location = $(el).find('.bukkenSpec td')
        .first().html().split('<br>');

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


      const [lotArea, lotAreaMax] = areas;
      return {
        id: 'homes-' + propUrl.split('/')
          .reduce((accu, curr) => curr ? curr : accu),
        propertyName: $(el).find('.bukkenName').text(),
        price,
        priceMax,
        address: location[location.length - 1],
        lotArea,
        lotAreaMax,
        propertyUrl: propUrl,
      };
    });
  });

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

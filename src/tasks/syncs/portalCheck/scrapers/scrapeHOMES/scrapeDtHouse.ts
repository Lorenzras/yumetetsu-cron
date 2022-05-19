import {Page} from 'puppeteer';
import {extractNumber, extractPrice} from '../../../../../utils';
import {IHouse} from '../../types';

export const scrapeDtHouse = async (
  page: Page,
  result?: IHouse[] | [],
) : Promise<IHouse[]> => {
  const data = await page.$$eval(
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
          id: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          retrievedDate: currDateTime,
          propertyName: $(el).find('.bukkenName').text(),
          rawPrice: rawPrice,
          price: 0,
          propertyUrl: propUrl,
          rawLotArea: lotArea,
          lotArea: 0,
          address: location[location.length - 1],
        };
      });
    },
  );

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
    return await scrapeDtHouse(page, cummulativeResult);
  }

  return cummulativeResult;
};

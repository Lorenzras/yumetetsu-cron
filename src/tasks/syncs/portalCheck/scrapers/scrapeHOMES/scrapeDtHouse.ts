import {Page} from 'puppeteer';
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
        const [lotArea, buildingArea] = $(el)
          .find('td.space').text().split('m²', 2);

        const propUrl: string = $(el).find('.prg-bukkenNameAnchor')
          .prop('href');

        const location = $(el).find('.bukkenSpec td')
          .first().html().split('<br>');

        return {
          id: 'homes-' + propUrl.split('/')
            .reduce((accu, curr) => curr ? curr : accu),
          retrievedDate: currDateTime,
          propertyName: $(el).find('.bukkenName').text(),
          price: $(el).find('.priceLabel').text(),
          propertyUrl: propUrl,
          lotArea: lotArea,
          buildingArea: buildingArea,
          address: location[location.length - 1],
        };
      });
    },
  );

  const cummulativeResult = [...(result ?? []), ...data];

  if (await page.$('.nextPage')) {
    await Promise.all([
      page.click('.nextPage'),
      page.waitForNavigation(),
    ]);
    return await scrapeDtHouse(page, cummulativeResult);
  }

  return cummulativeResult;
};

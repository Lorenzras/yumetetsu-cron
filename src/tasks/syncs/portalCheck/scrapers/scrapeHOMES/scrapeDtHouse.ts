import {Page} from 'puppeteer';
import {extractNumber, extractPrice} from '../../../../../utils';
import {IHouse} from '../../types';

export const scrapePage = async (page: Page) => {
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
  const data = await scrapePage(page);
  const populateNumbers = data
    .map<IHouse>(((item)=>({
    ...item,
    比較用価格: extractPrice(item.販売価格),
    比較用土地面積: extractNumber(item.土地面積),
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

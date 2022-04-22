import {ScrapeItem} from '../../types';
import {Page} from 'puppeteer';
import {kanji2number} from '@geolonia/japanese-numeral';

export const scrapePage = async (page: Page) : Promise<ScrapeItem[]> => {
  console.log(kanji2number('2,430万'.replace(/,円/g, '')));

  const properties = await page.$$eval(
    '.mod-mergeBuilding--sale',
    (els) => {
      return els.map((el) => {
        console.log(($(el).find('.priceLabel').text()));
        return {
          propertyName: $(el).find('.bukkenName').text(),
          price: $(el).find('.priceLabel').text().replace(/[,円]/g, ''),
        } as Record<keyof ScrapeItem, string | number>;
      });
    },
  );

  properties.forEach(
    (item) => {
      console.log(item.price);
      item.price = kanji2number(item.price.toString());
    },
  );

  console.log(properties);
  return [
    {
      propertyName: '',
      propertyType: '中古マンション',
      address: '',
      area: 1000,
      price: 90000,
      propertyUrl: '',
    },
  ];
};

import {kanji2number} from '@geolonia/japanese-numeral';
import {Page} from 'puppeteer';
import {extractPrice} from '../../../../../utils';
import {IHouse} from '../../types';

/* https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=050&bs=021&cn=9999999&cnb=0&ekTjCd=&ekTjNm=&hb=0&ht=9999999&kb=1&kt=9999999&sc=23201&ta=23&tb=0&tj=0&tt=9999999&bknlistmodeflg=2&pc=30&pn=1 */

export const scrapeDtHouse = async (
  page: Page,
  result?: IHouse[] | [],
): Promise<IHouse[] | []> => {
  /*
    処理
  */
  const datas: IHouse[] = await page.$$eval('.property_unit--osusume2',
    (list) => {
      return list.map<IHouse>((el) => {
        const title = $(el).find('.property_unit-title_wide').text().trim();
        const url = 'https://suumo.jp' + $(el).find('.property_unit-title_wide a').attr('href');
        const rawPrice = $(el).find('.dottable-value--2').text().trim();
        const address = $(el).find('dt:contains("所在地") ~ dd').text();
        const rawArea = $(el).find('dt:contains("土地面積") ~ dd').text();

        return {
          propertyType: '中古戸建',
          propertyName: title,
          propertyUrl: url,
          address: address,
          price: 0,
          rawPrice: rawPrice,
          lotArea: 0,
          rawLotArea: rawArea,
        };
      });
    });

  const newdatas = datas.map<IHouse>((val) => {
    const price = extractPrice(val.rawPrice);
    const area = val.rawLotArea.split('m')[0];
    return {
      ...val,
      price: price,
      lotArea: +area,
    };
  });

  return newdatas;
};

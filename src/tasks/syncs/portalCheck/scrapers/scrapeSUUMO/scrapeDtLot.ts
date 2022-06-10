import {Page} from 'puppeteer';
import {extractPrice, logger} from '../../../../../utils';
import {ILot, THandleScraper} from '../../types';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';

export const scrapeDtLot: THandleScraper = async (
  page: Page,
): Promise<ILot[] | []> => {
  try {
    let datas: ILot[] = await page.$$eval('.property_unit--osusume2',
      (list) => {
        return list.map<ILot>((el) => {
          const title = $(el).find('.property_unit-title_wide').text().trim();
          const url = 'https://suumo.jp' + $(el).find('.property_unit-title_wide a').attr('href');
          const rawPrice = $(el).find('.dottable-value--2').text().trim();
          const address = $(el).find('dt:contains("所在地") ~ dd').text();
          const rawArea = $(el).find('dt:contains("土地面積") ~ dd').text();
          const id = 'suumo-' + url.split('ncz')[1].split('.')[0];

          return {
            物件種別: '土地',
            物件番号: id,
            物件名: title,
            リンク: url,
            所在地: address,
            販売価格: rawPrice,
            比較用価格: 0,
            土地面積: rawArea,
            比較用土地面積: 0,
          };
        });
      });

    datas = datas.map<ILot>((val) => {
      const price = extractPrice(val.販売価格.split('円')[0]);
      const area = val.土地面積.split('m')[0];
      // scrapeContact(page, val);
      return {
        ...val,
        比較用価格: price,
        比較用土地面積: +area,
      };
    });
    return datas;
  } catch (error: any) {
    await logErrorScreenshot(page,
      `土地のスクレイピングに失敗しました。${page.url()} ${error.message}`);
    return [];
  }
};

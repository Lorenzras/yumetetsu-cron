import {Page} from 'puppeteer';
import {extractPrice, getTextByXPath, logger} from '../../../../../utils';
import {IHouse, THandleScraper} from '../../types';
import {logErrorScreenshot} from '../helpers/logErrorScreenshot';

export const scrapeDtHouse: THandleScraper = async (
  page: Page,
): Promise<IHouse[] | []> => {
  try {
    // PRは除く
    const els = await page.$$('.ListBukken__list__item:not(._devListBoxWrap)');
    const datas = Promise.all(
      els.map<Promise<IHouse>>(async (el) => {
        const title = await el.$eval('.ListCassette__title__text--single',
          (ch) => (ch as HTMLHeadElement).innerText);
        const url = await el.$eval('button',
          (ch) => ch.getAttribute('data-dtlurl') ?? '');

        const getXPath = (dtName: string) => {
          return `//dt[contains(text(), "${dtName}")]/following-sibling::dd`;
        };
        const rawPrice = await el.$x(getXPath('価格')) // ページ内の最初の価格を取得してしまう。
          .then(([xEl]) => page.evaluate((ch)=>{
            return (ch as HTMLElement).innerText ?? '';
          }, xEl));
        console.log('debag:: ', rawPrice);
        const address = await getTextByXPath(page, getXPath('所在地'), el );
        const rawArea = await getTextByXPath(page, getXPath('土地面積'), el );

        return {
          物件種別: '中古戸建',
          物件番号: '', // 'yahoo-' + url.split('/').at(-2),
          物件名: title,
          リンク: url,
          所在地: address,
          販売価格: rawPrice,
          比較用価格: 0,
          土地面積: rawArea,
          比較用土地面積: 0,
        };
      }));

    /* datas = datas.map<IHouse>((val) => {
      const price = extractPrice(val.販売価格.split('円')[0]);
      const area = val.土地面積.split('m')[0];
      return {
        ...val,
        比較用価格: price,
        比較用土地面積: +area,
      };
    }); */
    return datas;
  } catch (error: any) {
    await logErrorScreenshot(page,
      `中古戸建のスクレイピングに失敗しました。${page.url()} ${error.message}`);
    return ([{
      物件種別: '中古戸建',
      物件番号: '取得失敗',
      物件名: '取得失敗',
      リンク: '取得失敗',
      所在地: '取得失敗',
      販売価格: '取得失敗',
      比較用価格: 0,
      土地面積: '取得失敗',
      比較用土地面積: 0,
    }]);
  }
};

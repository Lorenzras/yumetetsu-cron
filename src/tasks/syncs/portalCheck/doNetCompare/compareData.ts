import {IProperty} from '../types';
import {Page} from 'puppeteer';
import {IPropSearchData} from './searchDoProperty';

export type TSearchResult = Required<Pick<
IProperty,
| 'DO管理有無'
| 'DO物件番号'
| 'DOステータス'
| 'DO登録価格'
| 'DO価格差'
| 'DO検索結果件数' >>

export const compareData = async (
  page: Page,
  data: IPropSearchData,
) : Promise<Array<TSearchResult>> => {
  const result = await page.evaluate(
    (data: IPropSearchData) : TSearchResult[]=>{
      const rows = Array.from(document.querySelectorAll('.ui-sortable tr'));
      const rowCount = rows.length.toString();
      const evalResult = rows.map<TSearchResult>((r) => {
        const col = $(r).children('td');
        const doPriceText = col.eq(8).find('span').text();
        const priceDiff = +data.price - +doPriceText;
        return {
          DOステータス: col.eq(7).text(),
          DO価格差: priceDiff.toString(),
          DO検索結果件数: rowCount,
          DO物件番号: col.eq(1).text(),
          DO登録価格: doPriceText,
          DO管理有無: '有',
        };
      });
      console.log(evalResult);
      return evalResult;
    }, data as unknown as {[k: string] : string});

  return result.length? result : [{
    DOステータス: '',
    DO価格差: '',
    DO検索結果件数: '',
    DO物件番号: '',
    DO登録価格: '',
    DO管理有無: '無',
  }];
};
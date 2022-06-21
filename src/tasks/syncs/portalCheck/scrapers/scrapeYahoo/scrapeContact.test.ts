import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {IProperty} from '../../types';
import {getContactLink, scrapeContact} from './scrapeContact';

// 中古戸建用 ハウスドゥ無
const data: IProperty = {
  物件種別: '中古戸建',
  物件名: '安城市古井町宮前',
  物件番号: 'yahoo-15QfyySHRGLvhhtCQ829Xt',
  所在地: '愛知県安城市古井町宮前 ',
  リンク: 'https://realestate.yahoo.co.jp/used/mansion/detail_ag/2mudhkDwjT4UI61QYJiUjY/',
  /* リンク: 'https://realestate.yahoo.co.jp/used/house/detail_ag/15QfyySHRGLvhhtCQ829Xt/#company', */
  販売価格: '4,490万円',
  比較用価格: 4490,
};
/* const data: IProperty = {
  物件種別: '中古戸建',
  物件名: 'aaa',
  物件番号: 'yahoo-***',
  所在地: 'aaa',
  リンク: 'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018596691/',
  販売価格: '1111円',
  比較用価格: 1111,
}; */
/* const data: IProperty = {
  物件種別: '中古戸建',
  物件名: 'aaa',
  物件番号: 'yahoo-***',
  所在地: 'aaa',
  リンク: 'https://realestate.yahoo.co.jp/used/house/detail_ag/A3jZbRxc46o5uSbr8vaxY/#company',
  販売価格: '1111円',
  比較用価格: 1111,
}; */

describe('scrapecontact', () => {
  test(('single'), async () => {
    const page = await openMockBrowserPage();
    const result = await scrapeContact(page, data);

    expect(result).toMatchSnapshot();
    page.browser().disconnect();
  }, browserTimeOut);

  /* test comand:: jest scrapeSUUMO/scrapeContact -t link -u */
  /* 'https://realestate.yahoo.co.jp/used/house/detail_ag/A3jZbRxc46o5uSbr8vaxY/#company',
      'https://realestate.yahoo.co.jp/used/house/detail_ag/15QfyySHRGLvhhtCQ829Xt/#company',
      'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018596691/',
      'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018762695/#tab', */
  test(('link'), async () => {
    // const page = await openMockBrowserPage();
    const testLinks = [
      // 'https://realestate.yahoo.co.jp/used/mansion/detail_corp/b0018766861/',
      // 'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018760118/',
      // 'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018596691/',
      // 'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018762695/#tab',
      // 'https://realestate.yahoo.co.jp/used/house/detail_corp/b0018775216/',
      // 'https://realestate.yahoo.co.jp/land/detail_corp/b0018783353/',
      // 'https://realestate.yahoo.co.jp/land/detail_corp/b0018812010/',
      // 'https://realestate.yahoo.co.jp/land/detail_corp/b0018815000/',
      // 'https://realestate.yahoo.co.jp/used/house/detail_ag/A3jZbRxc46o5uSbr8vaxY/#company',
      // 'https://realestate.yahoo.co.jp/used/house/detail_ag/15QfyySHRGLvhhtCQ829Xt/#company',
      'https://realestate.yahoo.co.jp/used/mansion/detail_corp/b0018830208/',
      'https://realestate.yahoo.co.jp/used/mansion/detail_corp/b0018492250/',
      'https://realestate.yahoo.co.jp/used/mansion/detail_ag/2mudhkDwjT4UI61QYJiUjY/',
    ];

    console.log(new Date());
    const result = [];
    for (const link of testLinks) {
      result.push(await getContactLink(link));
    }

    console.log(new Date());
    // await page.close();
    // page.browser().disconnect();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

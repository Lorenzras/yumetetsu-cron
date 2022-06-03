import {load} from 'cheerio';
import {Page} from 'puppeteer';
import {IProperty, THandleContactScraper} from '../../types';

export const scrapeContact: THandleContactScraper = async (
  page: Page,
  data: IProperty,
) => {
  const info = await getContactLink(page, data.リンク);

  return {
    ...data,
    掲載企業: info.掲載企業,
    掲載企業TEL: info.掲載企業TEL,
  };
};

/**
 *
 * @param page
 * @param url
 * @returns {IProperty | IMansion | IHouse | ILot} 物件情報
 */
export const getContactLink = async (
  page: Page,
  url: string,
) => {
  // 物件詳細ページを表示する
  await Promise.all([
    page.goto(url, {waitUntil: 'domcontentloaded'}),
    page.waitForNavigation(),
  ]);

  const info = url.indexOf('_corp') !== -1 ? getSingleLink(page) :
    url.indexOf('_ag') !== -1 ? getMultipleLink(page) :
      {掲載企業: '取得失敗', 掲載企業TEL: '取得失敗'};

  return info;
};

/**
 * 掲載企業情報が複数社の場合の処理
 * @param page
 * @returns {IProperty | IMansion | IHouse | ILot} 物件情報
 */
const getMultipleLink = async (page: Page) => {
  const htmlBody = await page.content();
  const $ = load(htmlBody);

  // 掲載企業数を取得する
  const kigyouNum = Number($('.DetailSummaryMain__tips__text')
    .eq(0).text().trim().replace(/[^0-9]/g, ''));

  // 代表企業の連絡先を取得する
  const tel = $('.DetailActionArea__tips__popup__cont__phone')
    .eq(0).text().trim();
  // 掲載企業名(複数)を取得する
  // puppeteerでの記述方法
  const kigyoumei = await page
    .$$eval('.DetailCompanyInfo2__companyName', (els) => {
      return els.map((el) => {
        return (el as HTMLElement).innerText;
      });
    });
  // jQueryでの記述方法
  /* const kigyoumei = $('.DetailCompanyInfo2__companyName')
    .map(
      (idx, el) => {
        return $(el).text(); // el=ELEMENTを
      },
    ).toArray(); */

  // 夢てつが含まれる場合、店舗名のみ取り出し、含まれない場合は''
  const shopName = kigyoumei.filter((item) => {
    return item.indexOf('夢のおてつだい') !== -1;
  }).join(',').replace(/株式会社|夢のおてつだい|[\x20\u3000]/g, '');

  if (shopName !== '') {
    return {
      掲載企業: shopName,
      掲載企業TEL: '省略',
    };
  } else {
    return {
      掲載企業: kigyoumei[0] + ' 他' + kigyouNum + '社',
      掲載企業TEL: '代表企業: ' + tel,
    };
  }

  // 夢てつが含まれる場合、店舗名のみ取り出し、含まれない場合undefined
  /* const yumeShopName: string | undefined = kigyoumei.reduce(
    (accu, curr) => {
      if (curr.indexOf('夢のおてつだい') !== -1) {
        let shopName = curr.replace(/株式会社|夢のおてつだい|[\x20\u3000]/g, '');
        return accu ? accu.concat(shopName) : shopName;
      } else {

      }
    }, undefined);
  if (yumeShopName) {
    // 自社取り扱い有の場合
    return {
      掲載企業: yumeShopName,
      掲載企業TEL: '省略',
    };
  } else {
    // 自社取り扱い無の場合
    return {
      掲載企業: kigyoumei[0] + ' 他 ' + (kigyouNum - 1) + ' 社',
      掲載企業TEL: '代表企業:' + tel,
    };
  } */
};

/**
 * 掲載企業情報が1社のみの場合の処理
 * @param page
 * @returns {IProperty | IMansion | IHouse | ILot} 物件情報
 */
const getSingleLink = async (page: Page) => {
  const htmlBody = await page.content();
  const $ = load(htmlBody);

  // 掲載企業名を取得する
  const kigyoumei = $('.DetailCompanyInfo2__companyName')
    .eq(0).children('a').eq(0).text().trim();
  // kigyoumei = kigyoumei.split('（')[1].split('）')[0];

  // 掲載企業の連絡先を取得する
  const tel = $('.DetailRichSummarySide__tips__popup__cont__phone')
    .eq(0).text().trim();

  return {
    掲載企業: kigyoumei,
    掲載企業TEL: tel,
  };
};

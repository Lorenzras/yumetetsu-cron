import {getHTML} from './../../../../../utils/dom';
import {extractTel} from '../../../../../utils';
import {IProperty} from '../../types';
import {load, CheerioAPI} from 'cheerio';

const scrapeCompanyDetailPage = async ($: CheerioAPI) => {
  return {
    掲載企業: $('.bkdt-shop-name em').text(),
    掲載企業TEL: $('.bkdt-shop-name ~ ul em').text(),
  };
};


const getContact = async (
  $: CheerioAPI, data: IProperty,
) : Promise<Partial<IProperty>> => {
  const floors = $('th:contains(所在階) ~ td')
    .eq(0).text().trim().split('/', 1)[0];

  // 「こちら」のリンクの有無を確認する
  const kochiraLink = $('.heikiToiawaseWindow ~ input')
    .eq(0).val() as string || '';

  const newPropName = `${data.物件名} ${floors}`;
  const newData: IProperty = {...data, 物件名: newPropName};

  let kigyoumei = '';
  let tel = '';


  if (!kochiraLink) {
    // 「こちら」のリンクがない場合
    kigyoumei = $('th:contains(お問い合せ先) ~ td')
      .eq(0).children('p').eq(0).text();
    tel = $('th:contains(お問い合せ先) ~ td')
      .eq(0).children('p').eq(1).text().trim();
    return {
      ...newData,
      掲載企業: kigyoumei,
      掲載企業TEL: tel,
    };
  } else {
    // 「こちら」のリンクがある場合
    return {
      ...newData,
      ...await scrapeCompanyDetailPage(
        load(await getHTML({url: kochiraLink})),
      ),
    };
  }
};

export const getContactByLinkFast = async (
  data: IProperty,
) => {
  const url = data.リンク;

  const $ = load(await getHTML({url})
    .catch((err) => {
      throw new Error(`Error getting main page ${err.message}`);
    }));

  if ($('#header div[title*="ライブラリー"]').length) {
    return {
      掲載企業: 'ページが無くなった。（ライブラリー）',
      掲載企業TEL: 'ページが無くなった。（ライブラリー）',
    };
  }

  if ($(
    [
      '.error_content-inner-pc', // エラーページ
      'img[src*="suumo_gomen"]', // お探しの情報は、当サイトへの掲載が終了しているか、一時的にご覧いただけません。
    ].join(','),
  ).length) {
    return {
      掲載企業: 'ページが無くなった',
      掲載企業TEL: 'ページが無くなった',
    };
  }

  if ($('table[summary="表"]').length) {
    return await getContact($, data);
  }

  // ここまで来たら、見たことがないページなので、エラーを出す。
  throw new Error(`Unknown page ${url}`);
};


export const scrapeContactFast = async (
  data: IProperty,
): Promise<IProperty> => {
  const info = await getContactByLinkFast(data);

  return {
    ...data,
    ...info,
    掲載企業TEL: extractTel(info?.掲載企業TEL || ''),
  };
};

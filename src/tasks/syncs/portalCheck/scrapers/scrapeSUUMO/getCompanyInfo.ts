import {Page} from 'puppeteer';
import {extractTel} from '../../../../../utils';
import {IProperty} from '../../types';

export const getCompanyInfo = async (
  page: Page,
  data: IProperty,
) => {
  // 物件詳細ページを表示する
  await Promise.all([
    page.goto(data.リンク, {waitUntil: 'networkidle2'}),
    page.waitForNavigation(),
  ]);

  console.log('処理確認::1', data.物件種別);
  let datas = await page.evaluate(() => {
    // マンションのみ、「所在階」を取得し、物件名に追加する
    const floors = $('th:contains(所在階) ~ td')
      .eq(0).text().trim().split('/', 1)[0];

    // 「こちら」のリンクの有無を確認する
    const link = $('.heikiToiawaseWindow ~ input')
      .eq(0).val() as string?? 'なし';

    // 「こちら」のリンクがない場合
    let kigyoumei = '';
    let tel = '';
    if (link === 'なし') {
      // 掲載企業名を取得する
      kigyoumei = $('th:contains(お問い合せ先) ~ td')
        .eq(0).children('p').eq(0).text();
      // 掲載企業の連絡先を取得する
      tel = $('th:contains(お問い合せ先) ~ td')
        .eq(0).children('p').eq(1).text().trim();
    }

    return {
      階数: floors,
      link: link,
      掲載企業: kigyoumei,
      掲載企業TEL: tel,
    };
  });

  console.log('return check 1::', datas);

  // 「こちら」のリンクがある場合
  if (datas.link !== 'なし' && datas.link) {
    // リンク先にジャンプする
    await Promise.all([
      page.goto(datas.link, {waitUntil: 'networkidle2'}),
      page.waitForNavigation(),
    ]);

    console.log('datas', datas);
    datas = await page.evaluate((datas) => {
      console.log('datas::', datas);
      const kigyoumei = $('.bkdt-shop-name').children('em').text();
      const tel = $('.bkdt-shop-name ~ ul')
        .children('li').children('em').text();

      return {
        ...datas,
        掲載企業: kigyoumei,
        掲載企業TEL: tel,
      };
    }, datas);

    console.log('datas::', datas);
  }

  return {
    ...datas,
    掲載企業TEL: extractTel(datas.掲載企業TEL),
  };
};

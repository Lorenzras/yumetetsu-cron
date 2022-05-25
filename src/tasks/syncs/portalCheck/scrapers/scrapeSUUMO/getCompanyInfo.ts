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
  const datas = await page.evaluate((el) => {
    // マンションのみ、「所在階」を取得し、物件名に追加する
    const floors = $(el).find('th:contains(所在階) ~ td')
      .eq(0).text().trim().split('/', 1)[0];

    // 「こちら」のリンクの有無を確認する
    const link = $(el).find('.heikiToiawaseWindow ~ input').eq(0).val();

    // 「こちら」のリンクがない場合
    let kigyoumei = '';
    let tel = '';
    if (!link) {
      // 掲載企業名を取得する
      kigyoumei = '';
      // 掲載企業の連絡先を取得する
      tel = '';
      /* const companyDates = {};

        return companyDates;
      }; */
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
  if (datas.link) {
    // リンク先にジャンプする
    await Promise.all([
      page.goto(datas.link, {waitUntil: 'networkidle2'}),
      page.waitForNavigation(),
    ]);

    await page.evaluate((el) => {
      const kigyoumei = $(el).find('.bkdt-shop-name').children('em').text();
      const tel = $(el).find('.bkdt-shop-name ~ ul')
        .children('li').children('em').text();

      return {...datas,
        kigyoumei: kigyoumei,
        tel: extractTel(tel),
      };
    });

    console.log('datas::', datas);
  }

  return datas;
};

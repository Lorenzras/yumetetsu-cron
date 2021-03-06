import {Page} from 'puppeteer';
import {extractTel, logger} from '../../../../../utils';
import {IProperty, THandleContactScraper} from '../../types';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';
import retry from 'async-retry';

export const scrapeContact: THandleContactScraper = async (
  page: Page,
  data: IProperty,
) => {
  const info = await getContactLink(page, data.リンク);
  return {
    ...data,
    物件名: data.物件名 + info.階数,
    掲載企業: info.掲載企業,
    掲載企業TEL: extractTel(info.掲載企業TEL),
  };
};

export const getContactLink = async (
  page: Page,
  url: string,
) => {
  try {
    // 物件詳細ページを表示する

    await retry(async ()=>{
      await page.goto(url, {waitUntil: 'domcontentloaded'});
    }, {
      retries: 3,
      minTimeout: 5000,
      maxTimeout: 10000,
      onRetry: (e, attempts)=>{
        logger.error(
          `Retrying to navigate to ${url} with ${attempts} attempt/s`);
      },
    });


    await Promise.race([
      page.waitForSelector('.btnRequest.jscBukkenshiryou'),
      page.waitForSelector('.error_content-inner-pc'),
      page.waitForSelector('img[src*="suumo_gomen"]'),
      page.waitForSelector('table[summary="表"]'),
    ]).catch(()=>{
      logger.error(
        'SUUMO scrapeContact failed to resolve any of the selectors.');
    });

    if (!await page.$('table[summary="表"]')) {
      return {
        階数: '',
        link: 'なし',
        掲載企業: 'ページ無くなった',
        掲載企業TEL: 'ページ無くなった',
      };
    }


    let info = await page.evaluate(() => {
      // マンションのみ、「所在階」を取得し、物件名に追加する
      const floors = $('th:contains(所在階) ~ td')
        .eq(0).text().trim().split('/', 1)[0];

      // 「こちら」のリンクの有無を確認する
      const link = $('.heikiToiawaseWindow ~ input')
        .eq(0).val() as string ?? 'なし';

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

    // 「こちら」のリンクがある場合
    if (info.link !== 'なし' && info.link) {
      // リンク先にジャンプする

      await retry(async ()=>{
        await page.goto(info.link, {waitUntil: 'domcontentloaded'});
      }, {
        retries: 3,
        minTimeout: 5000,
        maxTimeout: 10000,
        onRetry: (e, attempts)=>{
          logger.error(
            `Retrying to crawl to ${info.link} with ${attempts} attempt/s`);
        },
      });


      // 企業情報を取得する
      await page.waitForSelector('.bkdt-shop-name');
      info = await page.evaluate((info) => {
        const kigyoumei = $('.bkdt-shop-name').children('em').text();
        const tel = $('.bkdt-shop-name ~ ul')
          .children('li').children('em').text();

        return {
          ...info,
          掲載企業: kigyoumei,
          掲載企業TEL: tel,
        };
      }, info);
    }

    return info;
  } catch (error: any) {
    await logErrorScreenshot(page,
      `企業情報の取得に失敗しました。 ${url} ${page.url()} ${error.message}`,
    );
    return {
      階数: '',
      link: 'なし',
      掲載企業: '取得失敗',
      掲載企業TEL: '取得失敗',
    };
  }
};

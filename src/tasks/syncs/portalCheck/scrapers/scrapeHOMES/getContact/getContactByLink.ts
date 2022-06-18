import {getHTML} from './../../../../../../utils/dom';

import {logger} from './../../../../../../utils/logger';
import {scrapeSingleContact,
  scrapeSingleContactFast} from './scrapeSingleContact';
import {scrapeSingleContactLot,
  scrapeSingleContactLotFast} from './scrapeSingleContactLot';
import {Page} from 'puppeteer';

import {scrapeContactNew, scrapeContactNewFast} from './scrapeContactNew';

import {logErrorScreenshot} from '../../../helpers/logErrorScreenshot';
import {load} from 'cheerio';

const errorMatch = /終了しました|物件が見つかりません/;

export const getContactByLink = async (page: Page, url: string) => {
  try {
    // page.removeAllListeners();
    // await blockImages(page);
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    logger.info('link : ' + url);

    const task = await Promise.race([
      page
        .waitForSelector('p.attention a',
          {visible: true, timeout: 30000})
        .then(()=> 0),
      page
        .waitForSelector(
          '.realestate .inquire',
          {visible: true, timeout: 30000},
        )
        .then(()=> 1),
      page
        .waitForXPath(
          '//a//span[contains(text(), "詳細を見る")]/parent::a',
          {visible: true, timeout: 30000})
        .then(()=>2),
      page
        .waitForSelector(
          '.mod-notFoundMsg, .mod-bukkenNotFound, .mod-expiredInformation',
          {visible: true, timeout: 20000})
        .then(()=> 3),

    ]);

    switch (task) {
      case 0: return await scrapeSingleContact(page);
      case 1: return await scrapeSingleContactLot(page);
      case 2: return await scrapeContactNew(page);
      case 3: return {
        掲載企業: 'ページ無くなった',
        掲載企業TEL: 'ぺージ無くなった',
      };
      default: throw new Error(`Unknown page ${url}`);
    }
  } catch (err :any) {
    await logErrorScreenshot(
      page, `Failed to get contact ${url} ${err.message}`);
    return {
      掲載企業: '取得失敗',
      掲載企業TEL: '取得失敗',
    };
  }
};


export const getContactByLinkFast = async (url: string) => {
  try {
    logger.info(`Getting it fast ${url}`);

    // HOMES return 404 when page no longer exist,
    // Rather than let axios throw error, handle it here
    // to avoid retries from the calling process
    const htmlBody = await getHTML({url})
      .catch((err) => {
        console.log('Error', err.response.status, url);
        return err.response.status as string;
      });

    const $ = load(htmlBody);

    if ($(
      '.mod-notFoundMsg, .mod-bukkenNotFound, .mod-expiredInformation',
    ).length) {
      return {
        掲載企業: 'ページ無くなった',
        掲載企業TEL: 'ぺージ無くなった',
      };
    }

    if ($('p.attention a').length) {
      return await scrapeSingleContactFast($);
    } else if ($('.realestate .inquire').length) {
      return await scrapeSingleContactLotFast($);
    } else if ($('a span:contains(詳細を見る)').length) {
      return await scrapeContactNewFast($);
    } else {
      throw new Error(`Unknown page ${url}`);
    }
  } catch (err: any) {
    throw new Error(`HOMES.getContactByLinkFast ${err.message}`);
  }
};

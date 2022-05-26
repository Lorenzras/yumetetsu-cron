
import {logger} from './../../../../../../utils/logger';
import {scrapeSingleContact} from './scrapeSingleContact';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';
import {Page} from 'puppeteer';

import {scrapeContactNew} from './scrapeContactNew';

import {blockImages} from '../../../../../common/browser';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';

export const getContactByLink = async (page: Page, url: string) => {
  const initialVal = {
    掲載企業: '---',
    掲載企業TEL: '---',
  };
  try {
    page.removeAllListeners();
    await blockImages(page);
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
        .waitForSelector('.mod-notFoundMsg',
          {visible: true, timeout: 20000})
        .then(()=> 3),
    ]);
    switch (task) {
      case 0: return scrapeSingleContact(page);
      case 1: return scrapeSingleContactLot(page);
      case 2: return scrapeContactNew(page);
      case 3: return {
        掲載企業: '取得失敗 3',
        掲載企業TEL: '取得失敗 3',
      };
      default: return initialVal;
    }
  } catch (err :any) {
    await logErrorScreenshot(
      page, `Failed to get contact ${page.url()} ${err.message}`);
    return {
      掲載企業: '取得失敗',
      掲載企業TEL: '取得失敗',
    };
  }
};

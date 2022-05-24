import {getFileName} from './../../../../../../utils/file';
import {dlImg, kintoneAppId} from './../../../config';
import {logger} from './../../../../../../utils/logger';
import {blockImages} from '../../../../../common/browser';
import {scrapeSingleContact} from './scrapeSingleContact';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';
import {Page} from 'puppeteer';
import retry from 'async-retry';
import {scrapeRealtorPage} from './scrapeRealtorPage';

export const getContactByLink = async (page: Page, url: string) => {
  const initialVal = {
    掲載企業: '---',
    掲載企業TEL: '---',
  };
  return retry(async (bail, attempt)=>{
    // page.removeAllListeners();
    // await blockImages(page);
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    logger.info('link : ' + url);

    const task = await Promise.race([
      page
        .waitForSelector('p.attention a',
          {visible: true, timeout: 600000})
        .then(()=> 0),
      page
        .waitForSelector(
          '.realestate .inquire',
          {visible: true, timeout: 600000},
        )
        .then(()=> 1),
      page
        .waitForXPath(
          '//a//span[contains(text(), "詳細を見る")]/parent::a',
          {visible: true, timeout: 600000})
        .then(()=>2),
    ]).catch((err)=>{
      if (attempt >= 3) {
        bail(new Error('Failed'));
        logger.error('Get contact by link exceeded 3 tries');
        return initialVal;
      }
      throw new Error('Failed to find selector to get contact. ' + err.message);
    });

    switch (task) {
      case 0: return scrapeSingleContact(page);
      case 1: return scrapeSingleContactLot(page);
      case 2: return scrapeRealtorPage(page);
      default: return initialVal;
    }
  },
  {
    retries: 3,
    onRetry: async (e, attempt)=>{
      const errImgName = getFileName({
        dir: dlImg, appId: kintoneAppId, ext: 'png',
      });
      // eslint-disable-next-line max-len
      logger.error(`getContactByLink failed to find contact. ${page.url} ${errImgName} Attempt: ${attempt}`);
      await page.screenshot({
        path: errImgName,
      });
    },
  });
};

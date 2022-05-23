import {getFileName} from './../../../../../../utils/file';
import {dlImg, kintoneAppId} from './../../../config';
import {logger} from './../../../../../../utils/logger';
import {blockImages} from '../../../../../common/browser';
import {scrapeSingleContact} from './scrapeSingleContact';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';
import {Page} from 'puppeteer';
import retry from 'async-retry';

export const getContactByLink = async (page: Page, url: string) => {
  return retry(async (bail, attempt)=>{
    // page.removeAllListeners();
    // await blockImages(page);
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    logger.info('link : ' + url);

    const task = await Promise.race([
      page.waitForSelector('p.attention a', {visible: true, timeout: 20000})
        .then(()=> 0),
      page
        .waitForSelector(
          '.realestate .inquire',
          {visible: true, timeout: 20000},
        )
        .then(()=> 1),
    ]);

    switch (task) {
      case 0: return scrapeSingleContact(page);
      case 1: return scrapeSingleContactLot(page);
      default: return {
        掲載企業: '---',
        掲載企業TEL: '---',
      };
    }
  },
  {
    retries: 5,
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
  /* try {
    await blockImages(page);
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    logger.info('link : ' + url);

    const isLotPage = await Promise.race([
      page.waitForSelector('p.attention a')
        .then(()=> false).catch(),
      page.waitForSelector('.realestate .inquire')
        .then(()=> true).catch(),
    ]);


    return isLotPage ?
      await scrapeSingleContactLot(page) :
      await scrapeSingleContact(page);
  } catch (err: any) {
    logger.error(`getContactByLink Failed ${page.url()} ${err.message}` );
    return {
      掲載企業: '取得失敗',
      掲載企業TEL: '取得失',
    };
  } finally {
    page.removeAllListeners();
  } */
};

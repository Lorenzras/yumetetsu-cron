import {Page} from 'puppeteer';
import {logger} from '../../../../../../utils';
import {IProperty} from '../../../types';
import {scrapeSingleContact} from './scrapeSingleContact';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';
import {produce} from 'immer';


export const getContactByLink = async (page: Page, url: string) => {
  let isLotPage = false;
  try {
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    logger.info('link : ' + url);

    await Promise.race([
      page.waitForSelector('p.attention a')
        .then(()=> isLotPage = false),
      page.waitForSelector('.realestate .inquire')
        .then(()=>isLotPage = true),
    ]);

    return isLotPage ?
      await scrapeSingleContactLot(page) :
      await scrapeSingleContact(page);
  } catch {
    logger.error(`getContactByLink Failed ${page.url()}`);
  }

  return {
    掲載企業: '',
    掲載企業TEL: '',
  };
};

export const scrapeContacts = async (page: Page, data: IProperty[]) => {
  // const newPage = await page.browserContext().newPage();
  let nextState: IProperty[] = [...data];

  try {
    for (const [idx, val] of data.entries()) {
      /* let isLotPage = false;
      await page.goto(val.リンク, {waitUntil: 'domcontentloaded'});

      logger.info('link : ' + val.リンク);

      await Promise.race([
        page.waitForSelector('p.attention a').then(()=> isLotPage = false),
        page.waitForSelector('.realestate .inquire').then(()=>isLotPage = true),
      ]).catch(()=> logger.error('Failed'));

      logger.info(
        'navigating to ' + isLotPage ? ' lot page ' : ' ordinary page.');

      const {掲載企業, 掲載企業TEL} = isLotPage ?
        await scrapeSingleContactLot(page) :
        await scrapeSingleContact(page); */

      const {掲載企業, 掲載企業TEL} = await getContactByLink(page, val.リンク);

      nextState = produce(nextState, (draft: IProperty[]) => {
        draft[idx].掲載企業 = 掲載企業;
        draft[idx].掲載企業TEL = 掲載企業TEL;
      });
    }
  } catch {
    logger.error('Failed to get contact.');
    return nextState;
  }

  return nextState;
};

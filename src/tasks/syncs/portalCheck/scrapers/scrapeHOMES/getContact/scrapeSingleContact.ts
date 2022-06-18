import {getHTML} from './../../../../../../utils/dom';
import {logger} from '../../../../../../utils/logger';
import {Page} from 'puppeteer';

import {
  scrapeContactCompanyPage,
  scrapeContactCompanyPageFast} from './scrapeContactCompanyPage';
import {CheerioAPI, load} from 'cheerio';

export const scrapeSingleContact = async (page: Page ) => {
  let getKochiraLink: string;

  try {
    await page.waitForSelector('p.attention a', {timeout: 60000})
      .catch((err: any)=>{
        logger.error('scrapeSingleContact failed ' + err.message);
        throw new Error(err.message);
      });

    getKochiraLink = await page.$eval(
      'p.attention a',
      (el) => $(el).attr('href') || '',
    ).catch(()=>{
      logger.error(`getKochiralink failed at ${page.url}`);
      return '';
    });

    logger.info('Kochiralink ' + getKochiraLink);

    if (!getKochiraLink) {
      throw new Error('Failed to find kochira link');
    }

    await page.goto(getKochiraLink);
    return await scrapeContactCompanyPage(page);
  } catch (err: any) {
    logger.error(`scrapeSingleContact ${page.url()} ${err.message}`);
    return {
      掲載企業: '取得失敗',
      掲載企業TEL: '取得失敗',
    };
  }
};


export const scrapeSingleContactFast = async ($: CheerioAPI) => {
  const kochiraLink = $('p.attention a').attr('href') || '';
  try {
    if (!kochiraLink) {
      throw new Error(`Failed to find kochira link ${kochiraLink}`);
    }
    const htmlBody = await getHTML({url: kochiraLink});
    return await scrapeContactCompanyPageFast(load(htmlBody));
  } catch (err: any) {
    logger.error(`scrapeSingleContactFast ${err.message}`);
    return {
      掲載企業: '取得失敗',
      掲載企業TEL: '取得失敗',
    };
  }
};

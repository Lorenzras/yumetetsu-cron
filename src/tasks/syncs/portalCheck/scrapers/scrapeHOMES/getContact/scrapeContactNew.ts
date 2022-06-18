import {getHTML} from './../../../../../../utils/dom';
import {CheerioAPI, load} from 'cheerio';
import {logger} from '../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {TCompanyContact} from '../../../types';
import {
  scrapeContactCompanyPage,
  scrapeContactCompanyPageFast,
} from './scrapeContactCompanyPage';

/* A new property page that doesn't use JQuery,
  but the contact link still leads to legacy page.
*/
export const scrapeContactNew = async (page: Page ) => {
  let result : TCompanyContact = {
    掲載企業: '',
    掲載企業TEL: '',
  };
  let realtorPage: string;

  try {
    realtorPage = await page
      .$x('//a//span[contains(text(), "詳細を見る")]/parent::a')
      .then(([el])=>el)
      .then((el) => page.evaluate((el: HTMLAnchorElement) => {
        return el.getAttribute('href') || '';
      }, el))
      .catch((err: any)=>{
        logger.error(
          `get詳細を見る failed at ${page.url()} ${err.message}`);
        return '';
      });

    logger.info(`scrapeContactNew  ${realtorPage} --- ${page.url()}`);

    if (realtorPage) {
      await page.goto(realtorPage);
      const scrapedResult = await scrapeContactCompanyPage(page);
      result = {...result, ...scrapedResult};
    }
    return result;
  } catch (err: any) {
    logger.error(`scrapeSingleContact ${page.url()} ${err.message}`);
    return {
      ...result,
      掲載企業: '取得失敗',
    };
  }
};

export const scrapeContactNewFast = async ($: CheerioAPI ) => {
  try {
    const realtorPage = $('a span:contains(詳細を見る)')
      ?.parent('a')
      ?.attr('href');

    if (!realtorPage) {
      throw new Error(`Failed to scrape new page ${realtorPage}`);
    }

    return await scrapeContactCompanyPageFast(
      load(await getHTML({url: realtorPage})),
    );
  } catch (err: any) {
    logger.error(`HOMES scrapeSingleContactFast ${err.message}`);
    return {
      掲載企業: '取得失敗',
      掲載企業TEL: '',
    };
  }
};

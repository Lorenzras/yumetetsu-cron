import {logger} from '../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {TCompanyContact} from '../../../types';
import {scrapeContactCompanyPage} from './scrapeContactCompanyPage';

export const scrapeSingleContact = async (page: Page ) => {
  let result : TCompanyContact = {
    掲載企業: '---',
    掲載企業TEL: '---',
  };
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

    if (getKochiraLink) {
      await page.goto(getKochiraLink);
      const scrapedResult = await scrapeContactCompanyPage(page);
      result = {...result, ...scrapedResult};
    }
    return result;
  } catch (err: any) {
    logger.error(`scrapeSingleContact ${page.url()} ${err.message}`);
    return result;
  }
};

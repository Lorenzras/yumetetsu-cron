import {logger} from '../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {TCompanyContact} from '../../../types';

export const scrapeSingleContact = async (page: Page ) => {
  let result : TCompanyContact = {
    掲載企業: '',
    掲載企業TEL: '',
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
      await page.waitForSelector('.mod-realtorOutline');
      const scrapedResult = await page.$eval(
        '.mod-realtorOutline',
        (el) : TCompanyContact => {
          const companyName = $(el)
            .find('.realtorName ruby').html().split('<rt>', 1)[0];
          const companyTel = $(el)
            .find('th:contains(TEL) ~ td').text();
          return {
            掲載企業: companyName,
            掲載企業TEL: companyTel,
          };
        });
      logger.info(`Scraped companyName ${scrapedResult.掲載企業}`);
      result = {...result, ...scrapedResult};
    }
    return result;
  } catch (err: any) {
    logger.error(`scrapeSingleContact ${page.url()} ${err.message}`);
    return result;
  }
};

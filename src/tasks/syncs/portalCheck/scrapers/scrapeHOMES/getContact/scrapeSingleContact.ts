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
    getKochiraLink = await page.$eval(
      'p.attention a',
      (el) => $(el).attr('href') || '',
    ).catch(()=>'');

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
  } catch (error) {
    logger.error(`Error Link ${page.url()} ${error} }`);
  }

  return result;
};

import {Page} from 'puppeteer';
import {TCompanyContact} from '../../../types';
import {logger} from '../../../../../../utils';

export const scrapeContactCompanyPage = async (page: Page) => {
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
  return scrapedResult;
};

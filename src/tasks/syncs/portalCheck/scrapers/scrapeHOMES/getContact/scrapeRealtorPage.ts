import {logger} from '../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {TCompanyContact} from '../../../types';

export const scrapeRealtorPage = async (page: Page ) => {
  let result : TCompanyContact = {
    掲載企業: '---',
    掲載企業TEL: '---',
  };
  let realtorPage: string;

  try {
    realtorPage = await page
      .$x('//a//span[contains(text(), "詳細を見る")]/parent::a')
      .then(([el])=>el)
      .then((el) => page.evaluate((el: HTMLAnchorElement) => {
        return el.getAttribute('href') || '';
      }, el))
      .catch(()=>{
        logger.error(`getKochiralink failed at ${page.url}`);
        return '';
      });

    logger.info('Kochiralink ' + realtorPage);

    if (realtorPage) {
      await page.goto(realtorPage);
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

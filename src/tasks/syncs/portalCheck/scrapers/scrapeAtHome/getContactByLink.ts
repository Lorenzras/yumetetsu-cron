import {TCompanyContact} from '../../types';
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';

export const getContactByLink = async (
  page: Page, url: string,
) => {
  try {
    await page.goto(url);
    await page.waitForSelector('#item-detail_company');

    const result = await page.evaluate((): TCompanyContact => {
      const companyName = $('[data-label="不動産会社"]').text();
      console.log(companyName);
      console.log($('.company-data_name span').text().trim());
      return {
        掲載企業: companyName || $('.company-data_name span').text().trim(),
        掲載企業TEL: $('th:contains(TEL/FAX) ~ td').text().split('／', 1)[0].trim(),
      };
    });

    return result;
  } catch {
    logger.error(`Failed to retrive contact ${url}`);
    return {
      掲載企業: `取得失敗`,
      掲載企業TEL: `取得失敗`,
    };
  }
};



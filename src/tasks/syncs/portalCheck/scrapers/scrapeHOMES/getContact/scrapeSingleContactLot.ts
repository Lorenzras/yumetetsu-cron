import {logger} from '../../../../../../utils/logger';
import {Page} from 'puppeteer';
import {extractTel} from '../../../../../../utils';
import {TCompanyContact} from '../../../types';

export const scrapeSingleContactLot = async (page: Page) => {
  const mainSelector = '.realestate .inquire';
  page.waitForSelector(mainSelector, {timeout: 60000});

  const dirtyResult = await page.$eval(
    mainSelector,
    (el) : TCompanyContact => {
      const companyTel = $(el).find('span.tellNumber').text();
      const alternateTel = $(el).find('ul.annotation li').eq(1).text();

      return {
        掲載企業: $(el).find('th:contains(会社名) ~ td').text() || '',
        掲載企業TEL: alternateTel ? alternateTel : companyTel,
      };
    },
  );

  const cleanResult : TCompanyContact = {
    ...dirtyResult,
    掲載企業TEL: extractTel(dirtyResult.掲載企業TEL || ''),
  };

  return cleanResult;
};

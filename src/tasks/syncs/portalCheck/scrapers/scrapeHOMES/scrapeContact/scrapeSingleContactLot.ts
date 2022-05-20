import {Page} from 'puppeteer';
import {extractTel} from '../../../../../../utils';
import {TCompanyContact} from '../../../types';

export const scrapeSingleContactLot = async (page: Page) => {
  const result : TCompanyContact = {
    掲載企業: '',
    掲載企業TEL: '',
  };

  await page.waitForSelector('.inquireTell');
  const dirtyResult = await page.$eval(
    '.inquireTell',
    (el) : TCompanyContact => {
      const companyName = $(el).find('p.name').text();
      const companyTel = $(el).find('span.tellNumber').text();
      const alternateTel = $(el).find('ul.annotation').text();

      return {
        掲載企業: companyName,
        掲載企業TEL: alternateTel ? alternateTel : companyTel,
      };
    },
  );

  const cleanResult : TCompanyContact = {
    ...dirtyResult,
    掲載企業TEL: extractTel(dirtyResult.掲載企業TEL || ''),
  };

  return {...result, ...cleanResult};
};

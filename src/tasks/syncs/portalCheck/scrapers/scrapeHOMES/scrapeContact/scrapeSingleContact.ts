import {Page} from 'puppeteer';
import {TCompanyContact} from '../../../types';

export const scrapeSingleContact = async (page: Page ) => {
  let result : TCompanyContact = {
    掲載企業: '',
    掲載企業TEL: '',
  };

  const getKochiraLink = await page.$eval(
    'p.attention a',
    (el) => $(el).attr('href'),
  );

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
    result = {...result, ...scrapedResult};
  }

  return result;
};

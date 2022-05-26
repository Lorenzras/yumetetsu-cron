import {TCompanyContact} from '../../types';
import {Page} from 'puppeteer';
import {extractTel, logger} from '../../../../../utils';

const contactFromSamePage = async (page: Page) => {
  logger.info(`Retrieving contact at same page. ${page.url()}`);
  return await page.evaluate((): TCompanyContact => {
    const companyName = $('[data-label="不動産会社"]').text();
    console.log(companyName);
    console.log($('.company-data_name span').text().trim());
    return {
      掲載企業: companyName || $('.company-data_name span').text().trim(),
      掲載企業TEL: $('th:contains(TEL/FAX) ~ td').text().split('／', 1)[0].trim(),
    };
  });
};

export const scrapeCompanyPage = async (page: Page) => {
  logger.info(`Retrieving contact at company page. ${page.url()}`);
  await page.waitForSelector('#item-est_outline');
  const dirtyResult = await page
    .$eval('#item-est_outline', (el): TCompanyContact => {
      const companyName = $(el).find('li div:contains(商号)')
        .next().text().trim();
      const dirtyPhone = $(el).find('li div:contains(電話)')
        .next().text().trim();

      return {
        掲載企業: companyName || '',
        掲載企業TEL: dirtyPhone || '',
      };
    });

  return {
    ...dirtyResult,
    掲載企業TEL: extractTel(dirtyResult.掲載企業TEL || '')};
};

const contactFromModalLink = async (page: Page) => {
  logger.info(`Following company link inside modal. ${page.url()}`);
  const companyPage = await page.$eval('#modal-info_shop a', (el) => {
    return (el as HTMLAnchorElement).href;
  });

  if (!companyPage) {
    throw new Error(`Failed to find company link. ${page.url()}`);
  }

  await page.goto(companyPage);
  return await scrapeCompanyPage(page);
};

const pageResolver = async (page: Page) => {
  if (await page.$('#item-detail_company')) {
    return contactFromSamePage(page);
  } else if (await page.$('#modal-info_shop a')) {
    return contactFromModalLink(page);
  } else if (await page.$('#error-header')) {
    return {
      掲載企業: `ページ無くなった`,
      掲載企業TEL: `ページ無くなった`,
    };
  } else {
    throw new Error(`Failed to identify property page ${page.url()}`);
  }
};

export const getContactByLink = async (
  page: Page, url: string,
) => {
  try {
    await page.goto(url);

    logger.info(`Trying to identify property page ${page.url()}`);

    const result = await pageResolver(page);

    return result;
  } catch (err: any) {
    logger.error(`Failed to retrieve contact ${url} ${err.message}`);
    return {
      掲載企業: `取得失敗`,
      掲載企業TEL: `取得失敗`,
    };
  }
};



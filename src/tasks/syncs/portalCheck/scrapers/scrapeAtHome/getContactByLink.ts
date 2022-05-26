import {TCompanyContact} from '../../types';
import {Page} from 'puppeteer';
import {extractTel, logger} from '../../../../../utils';
import {logErrorScreenshot} from '../helpers/logErrorScreenshot';

const contactFromSamePage = async (page: Page) => {
  logger.info(`Retrieving contact at same page. ${page.url()}`);

  const companyName = await Promise.race([
    page.waitForSelector('[data-label="不動産会社"]'),
    page.waitForSelector('.company-data_name'),
  ]).then((el)=>{
    if (!el) return '';
    return page
      .evaluate((elem : HTMLElement) => elem.innerText, el);
  });
  // await page.waitForSelector('[data-label="不動産会社"]', {timeout: 600000});

  /*
  const companyName = await page.$eval(
    '[data-label="不動産会社"]',
  (el) => {
    return (el as HTMLAnchorElement)?.innerText;
  })
  || await page.$eval('.company-data_name', ()) */

  const telEl = await page.$x(
    '//th[contains(text(),\'TEL/FAX\')]/following-sibling::td',
  ).then(([telEl])=>telEl);

  const tel = await page.evaluate((telEl)=>{
    return (telEl as HTMLTableCellElement).innerText;
  }, telEl);
  /*   return await page.evaluate((): TCompanyContact => {
    const companyName = (
      document?.querySelector('[data-label="不動産会社"]') as HTMLAnchorElement
    )?.innerText || '';


    return {
      掲載企業: companyName || $('.company-data_name span').text().trim(),
      掲載企業TEL: $('th:contains(TEL/FAX) ~ td').text().split('／', 1)[0].trim(),
    };
  }); */

  return {
    掲載企業: companyName,
    掲載企業TEL: tel,
  };
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

type TPageType = 'samePage' | 'linkInModal' | 'notFound' | 'samePageNoLink'

const pageResolver = async (page: Page) => {
  const pageType: TPageType = await Promise.race([
    page.waitForSelector('#item-detail_company')
      .then(():TPageType => 'samePage'),
    page.waitForSelector('#modal-info_shop a').
      then(():TPageType =>'linkInModal'),
    page.waitForSelector('#error-header')
      .then(():TPageType=>'notFound'),
    page.waitForSelector('#modal-info_shop')
      .then(():TPageType=>'samePageNoLink'),
  ]);

  await page.waitForFunction(() => $);

  logger.info(`Identified page as ${pageType} ${page.url()}`);
  switch (pageType) {
    case 'notFound': return {
      掲載企業: `ページ無くなった`,
      掲載企業TEL: `ページ無くなった`,
    };
    case 'samePage': return contactFromSamePage(page);
    case 'linkInModal': return contactFromModalLink(page);
    case 'samePageNoLink': return {
      掲載企業: await page.$eval('#modal-info_shop', (el)=>{
        return (el as HTMLDivElement).innerText.trim();
      }),
      掲載企業TEL: `取得失敗`,
    };
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
    await logErrorScreenshot(
      page, `Failed to retrieve contact ${url} ${err.message}`);
    return {
      掲載企業: `取得失敗`,
      掲載企業TEL: `取得失敗`,
    };
  }
};



import {TCompanyContact} from '../../types';
import {Page} from 'puppeteer';
import {extractTel, logger} from '../../../../../utils';
import {logErrorScreenshot} from '../../helpers/logErrorScreenshot';
import axios from 'axios';
import {load} from 'cheerio';
import retry from 'async-retry';

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

  const telEl = await page.$x(
    '//th[contains(text(),\'TEL/FAX\')]/following-sibling::td',
  ).then(([telEl])=>telEl);

  const tel = await page.evaluate((telEl)=>{
    return (telEl as HTMLTableCellElement).innerText;
  }, telEl);


  return {
    掲載企業: companyName,
    掲載企業TEL: tel,
  };
};

export const scrapeCompanyPage = async (page: Page) => {
  logger.info(`Retrieving contact at company page. ${page.url()}`);
  await page.waitForSelector('#item-est_outline');
  await page.waitForFunction(() => jQuery);
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

const pageResolver = async (page: Page, url: string) => {
  logger.info(`Trying to identify property page ${page.url()}`);
  await page.goto(url);
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

/**
 * Fetch details in company page.
 *
 * @param urlPart
 */
const fetchCompanyPage = async (urlPart: string) =>{
  const fullUrl = `https://www.athome.co.jp${urlPart}`;
  logger.info(
    `Trying to fetch contact from the actual company page. ${fullUrl}`,
  );
  const html = await axios.post(fullUrl).then((resp)=> resp.data);
  const $ = load(html);
  return $('#item-est_outline li div:contains(電話)').next().text().trim();
};

export const getContactByLinkFast = async (url: string) =>{
  logger.info(`Trying to fetch html ${url}`);
  const html = await axios.post(url).then((resp)=> resp.data);
  const $ = load(html);

  // Shortcircuit if page have errors
  if ($('#error-header').length) {
    return {
      掲載企業: 'ページ無くなった',
      掲載企業TEL: 'ページ無くなった',
    };
  }

  // Actual scraping process
  const companyName = $('.company-data_name-flex a').text().trim() ||
  $('.company-data_name-flex').text().trim();
  let dirtyContact = $('th:contains("TEL/FAX") ~ td').text().trim();

  const companyLink = $('.company-data_name-flex a').attr('href');

  // If there is company link, crawl it.
  if (companyLink) {
    logger.info(`Found company link. crawling ${companyLink}`);
    dirtyContact = await fetchCompanyPage(companyLink);
  }

  if (companyName || dirtyContact) {
    return {
      掲載企業: companyName,
      掲載企業TEL: extractTel(dirtyContact),
    };
  }

  // Unknown page, so throw error
  throw new Error(`Unknown page ${url}`);
};

export const getContactByLink = async (
  page: Page, url: string,
) => {
  try {
    const companyDetails = await retry(
      async () => getContactByLinkFast(url),
      {
        retries: 2,
        minTimeout: 2000,
        onRetry: (e, tries) =>{
          logger
            .error(`Retrying fetch ${url} with ${tries} tries. ${e.message}`);
        },
      },
    );

    if (companyDetails) {
      logger.info(`Succesfully fetched html ${url}`);
      return companyDetails;
    } else {
      return await pageResolver(page, url);
    }
  } catch (err: any) {
    await logErrorScreenshot(
      page, `Failed to retrieve contact ${url} ${err.message}`);
    return {
      掲載企業: `取得失敗`,
      掲載企業TEL: `取得失敗`,
    };
  }
};



import {IProperty, THandleContactScraper} from './../types';
/* eslint-disable max-len */
import {logger} from './../../../../utils/logger';
import {
  handleContactScraper as homes,
  getContactByLinkFast as homesFast,
} from '../scrapers/scrapeHOMES';
import {
  scrapeContact as suumo,
  scrapeContactFast as suumoFast,
} from '../scrapers/scrapeSUUMO';
import {
  handleContactScraper as atHome,
  getContactByLinkFast as atHomeFast,
} from '../scrapers/scrapeAtHome';
import {scrapeContact as yahoo} from '../scrapers/scrapeYahoo/scrapeContact';
import {Cluster} from 'puppeteer-cluster';
import {Page} from 'puppeteer';
import _ from 'lodash';
import {getFileName, saveJSON} from '../../../../utils';
import {kintoneAppId, resultJSONPath} from '../config';

export const getCompanyDetails:
THandleContactScraper = async (page, data) => {
  const url = data.リンク;

  try {
    if (url.includes('homes.co.jp')) {
      return await homes(page, data);
    } else if (url.includes('suumo.jp')) {
      return await suumo(page, data);
    } else if (url.includes('athome.co.jp')) {
      return await atHome(page, data);
    } else if (url.includes('yahoo')) {
      return await yahoo(page, data);
    } else {
      return {
        ...data,
        掲載企業: '取得失敗：不明なリンク',
      };
    }
  } catch (err: any) {
    logger
      .error(`Fatal: failed to get contact details. ${JSON.stringify(data)} ${err.message}`);
    return {
      ...data,
      掲載企業TEL: '取得大失敗',
      掲載企業: '取得大失敗',
    };
  }
};

/**
 * Scraping by fetching just the HTML.
 * This could process hundreds of request per second,
 * but sites largely vary on how they respond to large volume of request.
 * So I am using cluster, to consistently apply throttling regardless of method.
 *
 * @param cluster
 * @param data
 * @returns {IProperty} Property
 */
export const getCompanyDetailsFast = async (
  cluster: Cluster<{page: Page}>,
  data: IProperty,
) => {
  const url = data.リンク;
  return await cluster.execute(async ({page})=>{
    await page.setContent(`<h1 style="font-size: 120px;">${url}</h1>`);
    if (url.includes('homes.co.jp')) {
      return await homesFast(url);
    } else if (url.includes('athome.co.jp')) {
      return await atHomeFast(url);
    } else if (url.includes('suumo.jp')) {
      return await suumoFast(data);
    }
  });
};

/**
 * Scraping by page manipulation.
 *
 * @param cluster
 * @param data
 * @returns {IProperty} Property
 */
const queGetCompanyDetails = async (
  cluster: Cluster<{page: Page}>,
  data: IProperty,
) => {
  return {...data, ...await cluster.execute(async ({page})=>{
    return await getCompanyDetails(page, data);
  }) as IProperty};
};

/**
 * Fetch company details.
 *
 * @param cluster
 * @param data
 * @returns {IProperty} Object with company details
 */
export const scrapeSingleCompany = async (
  cluster: Cluster<{page: Page}>,
  data: IProperty,
) => {
  const url = data.リンク;
  try {
    /*  Prioritize fast processing if available for the site.
    In case of error or if the site does not allow it,
    queue it to the cluster.
    */
    logger.info(`Started fast scrape for ${url}`);
    const fastResult = await getCompanyDetailsFast(cluster, data);
    if (fastResult) {
      logger.info(`Done fast scrape for ${url}`);
      return {...data, ...fastResult};
    }
  } catch (err: any) {
    logger.warn(`Fast Scrape error at ${err.message} ${url}. Queing it to cluster.`);
  }


  return await queGetCompanyDetails(cluster, data);
};


export const handleGetCompanyDetails = async (
  cluster: Cluster<{page: Page}>,
  dtArr: IProperty[],
) => {
  const filteredData = dtArr.filter((dt)=>{
    return (
      !dt.DO管理有無?.trim() ||
      dt.DO管理有無 === '無' ||
      (dt.DO管理有無 === '有' && +(dt.DO価格差 ?? 0) !== 0)
    );
  });
  const filteredDataLength = filteredData.length;

  logger.info(`Filtered results ${filteredDataLength}. Starting to scrape contact. `);

  const finalResults = await Promise.all(
    _.shuffle(filteredData)
      .map(async (data, idx) => {
        try {
          logger.info(`Fetching contact: ${idx + 1} of ${filteredDataLength} rows.`);
          return await scrapeSingleCompany(cluster, data);
        } catch (err: any) {
          logger.error(`Unhandled error at fetchingContact ${data.リンク} ${err.message}`);
          return {
            ...data,
            掲載企業: '処理失敗',
          };
        }
      }),
  );

  const filteredJSONFname = `-finalResults-${finalResults.length.toString()}`;
  logger.info(`Done scraping contact. Saving progress to ${filteredJSONFname}`);

  // Save final result to JSON
  await saveJSON(getFileName({
    appId: kintoneAppId,
    dir: resultJSONPath,
    suffix: filteredJSONFname,
  }), finalResults);

  return finalResults;
};

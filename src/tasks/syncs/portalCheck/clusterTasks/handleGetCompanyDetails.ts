import {IProperty, THandleContactScraper} from './../types';
/* eslint-disable max-len */
import {logger} from './../../../../utils/logger';
import {
  handleContactScraper as homes,
  getContactByLinkFast as homesFast,
} from '../scrapers/scrapeHOMES';
import {scrapeContact as suumo} from '../scrapers/scrapeSUUMO/scrapeContact';
import {
  handleContactScraper as atHome,
  getContactByLinkFast as atHomeFast,
} from '../scrapers/scrapeAtHome';
import {scrapeContact as yahoo} from '../scrapers/scrapeYahoo/scrapeContact';
import {Cluster} from 'puppeteer-cluster';
import {Page} from 'puppeteer';

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

export const getCompanyDetailsFast = async (
  url: string,
) => {
  if (url.includes('homes.co.jp')) {
    return await homesFast(url);
  } else if (url.includes('athome.co.jp')) {
    return await atHomeFast(url);
  }
};

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
export const handleGetCompanyDetails = async (
  cluster: Cluster<{page: Page}>,
  data: IProperty,
) => {
  const url = data.リンク;
  try {
    /*  Prioritize fast processing if available for the site.
    In case of error or if the site does not allow it,
    queue it to the cluster.
    */
    const fastResult = await getCompanyDetailsFast(url);
    if (fastResult) {
      return {...data, ...fastResult};
    }
  } catch (err) {
    logger.warn(`Fast fetch error at ${url}. Queing it to cluster.`);
  }


  return await queGetCompanyDetails(cluster, data);
};

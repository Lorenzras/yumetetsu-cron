import {getContactByLink} from './getContact';
import {IProperty, IPropertyAction, PropertyActions} from '../../types';
import {getExtraPuppeteer} from '../../../../common/browser/openBrowser';
import {browserTimeOut} from '../../../../common/browser/config';
import {logger} from '../../../../../utils/logger';
import {Cluster} from 'puppeteer-cluster';
import {scrapeDtMansion} from './scrapeDtMansion';
import {scrapeDtLot} from './scrapeDtLot';
import {scrapeDtHouse} from './scrapeDtHouse';

// import puppeteer from 'puppeteer-extra';
// import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import {clusterTask} from './clusterTask';
import {byAction} from './clusterQueues/byAction';

// puppeteer.use(stealthPlugin());

/* const propertyActions: PropertyActions = [
  {
    type: '中古戸建',
    url: 'https://www.homes.co.jp/kodate/chuko/tokai/',
    handleScraper: scrapeDtHouse,
  },
  {
    type: '中古マンション',
    url: 'https://www.homes.co.jp/mansion/chuko/tokai/',
    handleScraper: scrapeDtMansion,
  },
  {
    type: '土地',
    url: 'https://www.homes.co.jp/tochi/tokai/',
    handleScraper: scrapeDtLot,
  },
]; */

export interface IClusterTaskData extends IPropertyAction {
  pref: string,
  cities: string[]
}


/**
 * Concurrent processing of actions defined above.
 * Refer to scrapeHOMES for synchronous processing.
 */
export const clusterScraper = async () => {
  const cluster: Cluster<IClusterTaskData> = await Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    puppeteerOptions: {
      headless: false,

    },
    timeout: browserTimeOut,
  });

  logger.info(`Starting cluster.`);

  cluster.on('taskerror', (err, data) => {
    console.log(`Error crawling : ${err.message}`, data);
  });

  await cluster.task(clusterTask);

  await byAction(cluster);

  /*  const propertyProcessor = async (row: IProperty) =>{
    const newRow = await cluster.execute(async ({page})=>{
      const contact = await getContactByLink(page, row.リンク);

      return {...row, ...contact};
    });
    return newRow;
  };

  const propertyTypesProcessor = async (
    action : IPropertyAction, idx: number,
  ) => {
    logger.info(`Retrieving contacts for ${propertyActions[idx].type}`);
    const propDt = await cluster.execute(action) as IProperty[];
    const newPropDt = await Promise.all(propDt.map(propertyProcessor));
    return newPropDt;
  };


  const results = await Promise.all(
    propertyActions.map(propertyTypesProcessor),
  );

  results.forEach((res)=>{
    if ('length' in res) {
      console.log('row ', res?.length);
    }
  });
 */
  await cluster.idle();
  await cluster.close();
};

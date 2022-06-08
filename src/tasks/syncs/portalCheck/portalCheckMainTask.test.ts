import {scraperTask} from './clusterTasks/scraperTask';
import {browserTimeOut} from '../../common/browser/config';
import {initCluster, portalCheckMainTask} from './portalCheckMainTask';
import _ from 'lodash';
import {Cluster} from 'puppeteer-cluster';
import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';

import {saveToExcel} from './excelTask/saveToExcel';
import {IProperty} from './types';
import {handleGetCompanyDetails} from './clusterTasks/handleGetCompanyDetails';
import {actionsHOMES} from './scrapers/scrapeHOMES';
import {actionsAtHome} from './scrapers/scrapeAtHome/actionsAtHome';
import {
  suumoActions as actionsSUUMO,
} from './scrapers/scrapeSUUMO/suumoActions';
import {
  yahooActions as actionsYahoo,
} from './scrapers/scrapeYahoo/yahooActions';
import {resultJSONPath} from './config';

const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(resultJSONPath, fName), 'utf8');
  return JSON.parse(res);
};

describe('portalCheckMainProcess', ()=>{
  test('main', async ()=>{
    await portalCheckMainTask();
    expect(true);
  }, browserTimeOut);

  test('lite', async ()=>{
    const cluster: Cluster<{page: Page}> = await initCluster();
    const actions = [
      actionsHOMES()[1],
      // ...actionsAtHome(),
      // ...actionsSUUMO(),
      // ...actionsYahoo(),
      // actionsSUUMO()[2],
    ];

    await scraperTask(actions, cluster);


    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);

  test('contacts', async ()=>{
    // 失敗したものを取得させる
    const jsonFName = '199-20220606-120516-TFVph--finalResults-2435.json';
    const cluster: Cluster<{page: Page}> = await initCluster();
    const data: IProperty[] = getJSONData(jsonFName);

    const newData = await Promise.all(data.map(async (item) => {
      if (!item.掲載企業TEL?.trim()) {
        return await cluster.execute(({page}) => {
          return handleGetCompanyDetails(page, item);
        }) as IProperty;
      }

      return item;
    }));

    await saveToExcel(newData);
    console.log(newData.filter((item)=>!item.掲載企業TEL?.trim()).length);

    // saveToExcel(data)
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);
});

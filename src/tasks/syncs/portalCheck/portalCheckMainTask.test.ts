/* eslint-disable max-len */
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
import {saveMeta} from './helpers/saveMeta';
import {logger, sleep} from '../../../utils';

const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(resultJSONPath, fName), 'utf8');
  return JSON.parse(res);
};

describe('portalCheckMainProcess', ()=>{
  it('mainprocess', async ()=>{
    await portalCheckMainTask();
    expect(true);
  }, browserTimeOut);

  it('lite', async ()=>{
    const cluster: Cluster<{page: Page}> = await initCluster();

    const actions = [
      // ...actionsHOMES(),
      ...actionsHOMES(),
      // ...actionsAtHome(),
      // ...actionsSUUMO(),
      // ...actionsYahoo(),
      // actionsSUUMO()[2],
    ];

    await scraperTask(actions, cluster);
    await sleep(5000);

    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);

  it('contacts', async ()=>{
    // 失敗したものを取得させる
    const jsonFName = '199-20220609-035919-2E3du--doComparedDt-5231.json';
    const cluster: Cluster<{page: Page}> = await initCluster();
    const data: IProperty[] = getJSONData(jsonFName);
    const filteredData = data
      .filter((dt)=>{
        return (
          !dt.DO管理有無 ||
        dt.DO管理有無 === '無' ||
        (dt.DO管理有無 === '有' && +(dt.DO価格差 ?? 0) !== 0)
        );
      });

    const filterDataLength = filteredData.length;
    const newData = await Promise.all(_.shuffle(filteredData)
      .map(async (item, idx) => {
        if (!item.掲載企業TEL?.trim()) {
          return await cluster.execute(({page, worker}) => {
            logger.info(`Worker ${worker.id} at ${idx} of ${filterDataLength} is fetching contact from ${item.リンク}`);
            return handleGetCompanyDetails(page, item);
          }) as IProperty;
        }

        return item;
      }));

    await saveToExcel(newData);
    saveMeta(data, newData );

    await sleep(10000);
    // saveToExcel(data)
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);
});

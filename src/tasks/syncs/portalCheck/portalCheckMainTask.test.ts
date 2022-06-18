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
import {handleDonetCompare} from './clusterTasks/handleDonetCompare';

const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(resultJSONPath, fName), 'utf8');
  return JSON.parse(res) as IProperty[];
};

describe('portalCheckMainProcess', () => {
  it('mainTest', async () => {
    await portalCheckMainTask(false);
    expect(true);
  }, browserTimeOut);

  it('lite', async () => {
    const cluster: Cluster<{ page: Page }> = await initCluster();

    const actions = [
      ...actionsHOMES(),
      // ...(actionsHOMES().slice(2)),
      // ...actionsAtHome(),
      // ...actionsSUUMO(),
      // ...actionsYahoo(),
      // actionsSUUMO()[2],
    ];

    await scraperTask(actions, cluster, false);
    await sleep(5000);

    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);

  it('contacts', async () => {
    // donet結果を絞って、企業情報を取得する
    const jsonFName = '199-20220610-074022-QkBts--doComparedDt-5198.json';
    const cluster: Cluster<{ page: Page }> = await initCluster();
    const data: IProperty[] = getJSONData(jsonFName);
    const filteredData = data
      .filter((dt) => {
        return (
          !dt.DO管理有無 ||
          dt.DO管理有無 === '無' ||
          (dt.DO管理有無 === '有' && +(dt.DO価格差 ?? 0) !== 0)
        );
      });

    const filterDataLength = filteredData.length;
    const newData = await Promise.all(_.shuffle(filteredData)
      .map(async (data, idx) => {
        logger.info(`Fetching contact: ${idx + 1} of ${filterDataLength} rows.`);
        return await handleGetCompanyDetails(cluster, data);
      }));

    await saveToExcel(newData);
    saveMeta({
      beforeGetContact: data,
      afterGetContact: newData,
      saveToNetWorkDrive: false,
      startTime: new Date(),
    });

    // await sleep(10000);
    // saveToExcel(data)
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);

  it('failedOnly', async () => {
    // 失敗したものだけ再処理させる
    const beforeGetContacts = '199-20220614-015730-opbyZ--doComparedDt-5551.json';
    const afterGetContacts = '199-20220614-025540-ULL5L--finalResults-2452.json';
    const cluster: Cluster<{ page: Page }> = await initCluster();
    const afterData = await handleDonetCompare(cluster, getJSONData(afterGetContacts) );

    /*   const  = afterData
      .filter((dt) => !dt.DO管理有無?.trim() ); */

    const filterDataLength = afterData.length;
    const newDataWithContacts = await Promise.all(_.shuffle(afterData)
      .map(async (data, idx) => {
        if (data.掲載企業?.includes('失敗') || data.掲載企業?.includes('無くなった')) {
          logger.info(`Fetching contact: ${idx + 1} of ${filterDataLength} rows.`);
          return await handleGetCompanyDetails(cluster, data);
        }

        return data;
      }));

    await saveToExcel(newDataWithContacts, false);
    saveMeta({
      beforeGetContact: getJSONData(beforeGetContacts),
      afterGetContact: newDataWithContacts,
      startTime: new Date(),
      saveToNetWorkDrive: false,
    });

    // await sleep(10000);
    // saveToExcel(data)
    await cluster.idle();
    await cluster.close();
    logger.info('DONE');
  }, browserTimeOut);
});

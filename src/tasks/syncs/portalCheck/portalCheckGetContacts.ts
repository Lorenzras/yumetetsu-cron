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
import {resultJSONPath} from './config';
import {saveMeta} from './helpers/saveMeta';
import {logger} from '../../../utils';

const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(resultJSONPath, fName), 'utf8');
  return JSON.parse(res);
};

export const portalCheckGetContacts = async ()=>{
  const startTime = new Date();
  const jsonFName = '199-20220611-163407-mT7s9--doComparedDt-5288.json';
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
    .map(async (item, idx) => {
      try {
        return await cluster.execute(async ({page, worker}) => {
          logger.info(`Worker ${worker.id} at ${idx} of ${filterDataLength} is fetching contact from ${item.リンク}`);
          const res = await handleGetCompanyDetails(page, item);
          logger.info(`Worker ${worker.id} at ${idx} of ${filterDataLength} is DONE fetching contact from ${item.リンク}`);
          return res;
        }) as IProperty;
      } catch {
        return item;
      }
    }));

  logger.info('DONE fetching contacts. Starting to save!');

  await saveToExcel(newData, false);
  saveMeta({
    beforeGetContact: data,
    afterGetContact: newData,
    saveToNetWorkDrive: false,
    startTime,
  });
  // data, newData, false
  // await sleep(10000);
  // saveToExcel(data)
  await cluster.idle();
  await cluster.close();
  logger.info('done');
};

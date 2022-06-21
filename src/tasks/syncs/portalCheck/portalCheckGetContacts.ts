/* eslint-disable max-len */
import {initCluster} from './portalCheckMainTask';
import {Cluster} from 'puppeteer-cluster';
import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';


import {IProperty} from './types';
import {handleGetCompanyDetails} from './clusterTasks/handleGetCompanyDetails';
import {resultJSONPath} from './config';
import {logger} from '../../../utils';
import {handleSaveOutput} from './clusterTasks/handleSaveOutput';

const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(resultJSONPath, fName), 'utf8');
  return JSON.parse(res);
};

export const portalCheckGetContacts = async (saveToNetWorkDrive = true)=>{
  const startTime = new Date();
  const jsonFName = '199-20220611-163407-mT7s9--doComparedDt-5288.json';
  const cluster: Cluster<{ page: Page }> = await initCluster();
  const data: IProperty[] = getJSONData(jsonFName);

  const newData = await handleGetCompanyDetails(cluster, data);
  await handleSaveOutput({
    cluster,
    doComparedDt: data,
    finalResults: newData,
    startTime,
    saveToNetWorkDrive,
  });

  await cluster.idle();
  await cluster.close();
  logger.info('done');
};

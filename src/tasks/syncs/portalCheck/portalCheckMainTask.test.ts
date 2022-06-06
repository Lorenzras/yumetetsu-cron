import {browserTimeOut} from '../../common/browser/config';
import {initCluster, portalCheckMainTask} from './portalCheckMainTask';
import _ from 'lodash';
import {Cluster} from 'puppeteer-cluster';
import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';
import {dlJSON} from './config';
import {saveToExcel} from './excelTask/saveToExcel';
import {IProperty} from './types';
import {handleGetCompanyDetails} from './clusterTasks/handleGetCompanyDetails';

const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(dlJSON, fName), 'utf8');
  return JSON.parse(res);
};

describe('portalCheckMainProcess', ()=>{
  test('main', async ()=>{
    await portalCheckMainTask();
    expect('');
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

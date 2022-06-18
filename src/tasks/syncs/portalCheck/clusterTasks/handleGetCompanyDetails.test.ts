import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {openBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {login} from '../../../common/doNet';
import {initCluster} from '../portalCheckMainTask';
import {IProperty} from '../types';
import {handleDonetCompare, saveCookie, setCookie} from './handleDonetCompare';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import dtArr from './test/homes.json';

describe('handleGetCompanyDetails', ()=>{
  test('main', async ()=>{
    const cluster: Cluster<{page: Page}> = await initCluster();

    const result = await Promise.all(dtArr
      .map((item)=>{
        return handleGetCompanyDetails(cluster, item as IProperty);
      }));


    console.log(result.length);

    expect(result).toMatchSnapshot();
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);
});


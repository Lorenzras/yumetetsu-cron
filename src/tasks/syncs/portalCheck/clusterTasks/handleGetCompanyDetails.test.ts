import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {openBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {login} from '../../../common/doNet';
import {initCluster} from '../portalCheckMainTask';
import {IProperty} from '../types';
import {handleDonetCompare, saveCookie, setCookie} from './handleDonetCompare';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import dtArr from './test/199-20220531-063130-XVAu1.json';

describe('handleDonetCompare', ()=>{
  test('main', async ()=>{
    const cluster: Cluster<{page: Page}> = await initCluster();

    const result = await Promise.all(dtArr
      .map((item)=>{
        return cluster.execute(({page})=>{
          return handleGetCompanyDetails(page, item as IProperty);
        });
      }));


    console.log(result.length);

    expect(result).toMatchSnapshot();
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);
});


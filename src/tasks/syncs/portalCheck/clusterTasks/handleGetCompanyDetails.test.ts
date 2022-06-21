/* eslint-disable max-len */
import {logger} from './../../../../utils/logger';
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {sleep} from '../../../../utils';
import {openBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {login} from '../../../common/doNet';
import {initCluster} from '../portalCheckMainTask';
import {IProperty} from '../types';
import {handleDonetCompare, saveCookie, setCookie} from './handleDonetCompare';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import dtArr from './test/all.json';

describe('handleGetCompanyDetails', ()=>{
  test('main', async ()=>{
    const cluster: Cluster<{page: Page}> = await initCluster();

    const result = await handleGetCompanyDetails(
      cluster,
      dtArr as IProperty[],
    );


    console.log(result.length);

    expect(result).toMatchSnapshot();

    await sleep(3000);
    logger.info('Closing');
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);
});


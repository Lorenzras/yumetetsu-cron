import {openBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {login} from '../../../common/doNet';
import {initCluster} from '../portalCheckMainTask';
import {IProperty} from '../types';
import {handleDonetCompare, saveCookie, setCookie} from './handleDonetCompare';
import dtArr from './test/199-20220531-063130-XVAu1.json';

describe('handleDonetCompare', ()=>{
  test('main', async ()=>{
    const cluster = await initCluster();
    const result = await handleDonetCompare(cluster, dtArr as IProperty[]);


    console.log(result.length);

    expect(result).toMatchSnapshot();
    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);

  test('saveCookie', async ()=>{
    const page = await openBrowserPage();
    await login(page);
    await saveCookie(page, 1);
    await page.close();
  }, browserTimeOut);

  test('setCookie', async ()=>{
    const page = await openBrowserPage();
    await setCookie(page, 1);

    console.log('Done. Waiting to quit...');
    await page.waitForTimeout(5000);
    await page.close();
  }, browserTimeOut);
});


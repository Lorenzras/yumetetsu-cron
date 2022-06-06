/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {IProperty} from '../types';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {logger} from '../../../../utils';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const saveCookie = async (page: Page, workerId: number) => {
  const workerCookie = await page.cookies();
  const cookiePath = path.join(
    __dirname, 'cookies', `donet-${workerId}.json`);
  fs.writeFileSync(cookiePath, JSON.stringify(workerCookie));
};

const setCookie = async (page: Page, workerId: number) => {
  try {
    const cookiePath = path.join(
      __dirname, 'cookies', `donet-${workerId}.json`);
    const cookiesString = fs.readFileSync(cookiePath, 'utf8');

    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    await page.goto('https://manage.do-network.com/estate');
  } catch (err) {
    logger.warn('I was not able to load the cookie.');
  }
};

/**
 * Split properties into chunks then compare each item to donet.
 * This was designed to reuse the browser for each chunk.
 *
 * However, Chrome's memory leak kicks in when the browser is open for
 * a long time, so I reverted back to 1 task/thread and just
 * have dedicated cookie file for each worker.
 *
 * I'll refactor this again.
 *
 * @param cluster Cluster object
 * @param dtArr unprocessed IProperty[]
 * @returns {IProperty[]} Processed properties.
 */
export const handleDonetCompare = async (
  cluster: Cluster<{page: Page}>,
  dtArr: IProperty[],
) => {
  const dtArrLength = dtArr.length;

  const newDtArr = await Promise.all(dtArr.map(async (prop, idx) => {
    try {
      return await cluster.execute(async ({page, worker}) => {
      /*       const client = await page.target().createCDPSession();
      await client.send('Network.emulateNetworkConditions', {
        'offline': false,
        'downloadThroughput': 750 * 1024 / 8,
        'uploadThroughput': 250 * 1024 / 8,
        'latency': 100,
      }); */
        const logSuffix = `Worker ${worker.id} at task ${idx + 1} of ${dtArrLength} `;
        await setCookie(page, worker.id);

        logger.info(`${logSuffix}`);
        const doNetComparedResults = await searchDoProperty(
          {
            page,
            inputData: prop,
            logSuffix,
          },
        ) ?? {
          DO管理有無: '処理エラー',
        } as IProperty;

        await saveCookie(page, worker.id);

        const firstComparedResult = doNetComparedResults[0];


        return {
          ...prop,
          ...firstComparedResult,
        };
      }) as IProperty;
    } catch (err: any) {
      logger.error(`Unhandled error at clusterTasks.handleDonetCompare ${err.message}`);
      return prop;
    }
  }));


  return newDtArr;
};

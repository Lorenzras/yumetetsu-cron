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
    return await cluster.execute(async ({page, worker}) => {
      const client = await page.target().createCDPSession();
      await client.send('Network.emulateNetworkConditions', {
        'offline': false,
        'downloadThroughput': 750 * 1024 / 8,
        'uploadThroughput': 250 * 1024 / 8,
        'latency': 100,
      });
      await setCookie(page, worker.id);

      logger.info(`Donet compare progress: ${idx + 1} / ${dtArrLength}`);
      const doNetComparedResults = await searchDoProperty(
        {page, inputData: prop},
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
  }));

  /* const chunkedResult =
  await Promise.all(chunks.map( async (props, psIdx) => {
    const propsLength = props.length;
    return await Promise.all(props.map( async (prop, pIdx)=>{
      return await cluster.execute(async ({page, worker}) => {
        await setCookie(page, worker.id);

        const doNetComparedResults = await searchDoProperty(
          {page, inputData: prop},
        ) ?? {
          DO管理有無: '処理エラー',
        } as IProperty;

        await saveCookie(page, worker.id);

        const firstComparedResult = doNetComparedResults[0];

        logger.info(`Compared ${
          [
            (pIdx + 1) + ' IProperty ',
            propsLength + ' IProperty[] ',
            (psIdx + 1) + ' chunk ',
            chunkLength + ' chunk[] ',
          ].join(' / ')
        }  with total length ${dtArrLength} `);

        return {
          ...prop,
          ...firstComparedResult,
        };
      }) as IProperty;
    }));
  })); */


  return newDtArr;
};

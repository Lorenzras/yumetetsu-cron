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

export const handleDonetCompare = async (
  cluster: Cluster<{page: Page}>,
  dtArr: IProperty[],
) => {
  const clusterSize = +process.env.CLUSTER_MAXCONCURRENCY;
  const dtArrLength = dtArr.length;
  const chunkSize = Math.ceil(dtArrLength / clusterSize);
  const chunks = _.chunk(dtArr, chunkSize);
  const chunkLength = chunks.length;
  const chunkedResult = await Promise.all(chunks.map( async (props, psIdx) => {
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
    /*  return await cluster.execute(async ({page, worker}) => {
      let pIdx = 0;
      const newProps: IProperty[] = [];
      for (const prop of props) {
        const doNetComparedResults = await searchDoProperty(
          {page, inputData: prop},
        ) ?? {
          DO管理有無: '処理エラー',
        } as IProperty;
        const firstComparedResult = doNetComparedResults[0];

        logger.info(`Compared ${
          [
            (pIdx + 1) + ' IProperty ',
            propsLength + ' IProperty[] ',
            (psIdx + 1) + ' chunk ',
            chunkLength + ' chunk[] ',
          ].join(' / ')
        }  with total length ${dtArrLength} `);

        newProps.push({
          ...prop,
          ...firstComparedResult,
        });

        pIdx++;
      }

      return newProps;
    }) as IProperty[]; */
  }));


  return chunkedResult.flat();
};

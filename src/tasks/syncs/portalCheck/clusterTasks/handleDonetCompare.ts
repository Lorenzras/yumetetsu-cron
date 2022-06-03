import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {IProperty} from '../types';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {logger} from '../../../../utils';

import _ from 'lodash';


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
    return await cluster.execute(async ({page}) => {
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
    }) as IProperty[];
  }));


  return chunkedResult.flat();
};

/* eslint-disable max-len */
import {saveJSONToCSV, saveJSON, getFileName} from './../../../../utils/file';
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {TSearchResult} from '../doNetCompare/compareData';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {IAction, IProperty} from '../types';
import {dlJSON, dlPortalCheck, kintoneAppId} from '../config';
import {logger} from '../../../../utils';
import _ from 'lodash';
import {saveToExcel} from '../excelTask/saveToExcel';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import {uploadTask} from './uploadTask';
import {handleDonetCompare} from './handleDonetCompare';


type TScraperTask = (
  actions: IAction[], cluster: Cluster<{page: Page}>
) => Promise<IProperty[]>

export const scraperTask: TScraperTask = async (actions, cluster) => {
  // Shuffle actions to spread network traffic between sites.
  const shuffledActions = _.shuffle(actions);


  const handleAddPropertyType = (action: IAction, dtArr: IProperty[]) => {
    return dtArr.map((dt) => ({
      ...dt,
      物件種別: action.type,
    }));
  };


  const handleAction = async (action: IAction) => {
    const {
      pref, type, handleScraper, handlePrepareForm,
    } = action;

    const initialResult : IProperty[] = await cluster
      .execute(async ({page}) => {
        let formState = await handlePrepareForm(page, pref, type);
        const res: IProperty[] = [];

        console.log(formState);

        if (typeof formState === 'boolean' ) {
          if (formState) {
            res.push(...await handleScraper(page));
          }
        } else {
          // This handles edge cases where the site limits the number of cities selected. e.g. Yahoo
          // console.log('FORM', formState.chunkLength, formState.nextIdx);
          while (
            typeof formState !== 'boolean' &&
            formState.nextIdx <= formState.chunkLength) {
            console.log('FORM', formState.chunkLength, formState.nextIdx);
            // if (formState.success) {
            if (formState.success) {
              res.push(...await handleScraper(page));
            }
            formState = await handlePrepareForm(page, pref, type, formState.nextIdx);
            // } else {
            //   logger.error(`handlePrepareForm failed. ${JSON.stringify(formState)}`);
            // }
          }
        }

        logger.info(`Scraped total of ${res.length} from ${page.url()}`);
        return res;
      });

    const dataWithType = handleAddPropertyType(action, initialResult);

    return dataWithType;
  };


  // Main thread emitter
  const intermediateResults = (await Promise.all(
    shuffledActions.map(async (action) => {
      return await handleAction(action);
    }),
  )).flat();

  const totalScrapeLength = intermediateResults.length;
  // Compare to donet
  const doComparedDt = await handleDonetCompare(cluster, intermediateResults);

  // Filter data
  const filteredData = doComparedDt.filter((dt)=>{
    if (dt.DO管理有無 === '無' ||
    (dt.DO管理有無 === '有' && +(dt.DO価格差 ?? 0) !== 0)) {
      return true;
    }
  });

  // Scrape company info
  const filteredDataLength = filteredData.length;
  const finalResults = await Promise.all(
    _.shuffle(filteredData)
      .map(async (data, idx) => {
        return cluster.execute(({page})=>{
          logger.info(`Fetching contact: ${idx + 1} of ${filteredDataLength} rows.`);
          return handleGetCompanyDetails(page, data);
        }) as Promise<IProperty>;
      }),
  );

  logger.info(`Scraped: ${totalScrapeLength} Final: ${filteredDataLength} rows.`);

  // Finishing task

  await saveJSON(getFileName({
    appId: kintoneAppId,
    dir: dlJSON,
    suffix: finalResults.length.toString(),
  }), finalResults);

  await saveToExcel(finalResults);

  const csvFile = await saveJSONToCSV(getFileName({
    appId: kintoneAppId,
    dir: dlPortalCheck,
    suffix: `${finalResults.length.toString()}`,
  }), finalResults);

  if (csvFile) {
    await cluster.queue(({page})=> uploadTask(page, csvFile));
  }

  return finalResults;
};

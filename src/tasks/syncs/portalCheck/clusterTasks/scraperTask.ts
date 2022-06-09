import {resultJSONPath, kintoneAppId, resultCSVPath} from './../config';
/* eslint-disable max-len */
import {saveJSONToCSV, saveJSON, getFileName} from './../../../../utils/file';
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {TSearchResult} from '../doNetCompare/compareData';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {IAction, IProperty} from '../types';
import {logger} from '../../../../utils';
import _ from 'lodash';
import {saveToExcel} from '../excelTask/saveToExcel';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import {uploadTask} from './uploadTask';
import {handleDonetCompare} from './handleDonetCompare';
import {saveMeta} from '../helpers/saveMeta';


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
    const res: IProperty[] = [];
    try {
      const initialResult : IProperty[] = await cluster
        .execute(async ({page}) => {
          let isIterate = true;
          let idx = 0;
          do {
            const formState = await handlePrepareForm(page, pref, type, idx);

            if (
              (typeof formState === 'boolean' && formState) ||
              (typeof formState !== 'boolean' && formState.success)
            ) {
              res.push(...await handleScraper(page));
            }

            if (typeof formState !== 'boolean' ) {
              isIterate = formState.nextIdx < formState.chunkLength;
              idx = formState.nextIdx;
            } else {
              isIterate = false;
            }
          } while (isIterate);

          logger.info(`Scraped total of ${res.length} from ${page.url()}`);
          return res;
        });

      const dataWithType = handleAddPropertyType(action, initialResult);

      return dataWithType;
    } catch (err: any) {
      logger.error(`Unhandled error at scraperTask.handleAction ${pref} ${type} $ ${err.message}`);
      return res;
    }
  };


  /**
   * Stores all scraped properties from designated actions.
   */
  const intermediateResults = (await Promise.all(
    shuffledActions.map(async (action) => {
      return await handleAction(action);
    }),
  )).flat();

  const totalScrapeLength = intermediateResults.length;
  logger.info(`Scraped results ${totalScrapeLength}. Starting to compare to doNet.`);

  /**
   * Stores properties that were collated with donetwork
   */
  const doComparedDt = await handleDonetCompare(cluster, intermediateResults);
  await saveJSON(getFileName({
    appId: kintoneAppId,
    dir: resultJSONPath,
    suffix: '-doComparedDt-' + doComparedDt.length.toString(),
  }), doComparedDt);
  logger.info(`Done comparing to donet. Starting to filter.`);

  /**
   * Stores filtered properties that do not exist in donetwork and
   * those that exist but with price diffence.
   */
  const filteredData = doComparedDt.filter((dt)=>{
    return (
      !dt.DO管理有無 ||
      dt.DO管理有無 === '無' ||
      (dt.DO管理有無 === '有' && +(dt.DO価格差 ?? 0) !== 0)
    );
  });
  const filteredDataLength = filteredData.length;

  logger.info(`Filtered results ${filteredDataLength}. Starting to scrape contact. `);
  // Scrape company info

  /**
   * Stores properties with contact information.
   * This shuffles the array prior to processing
   * to minimize simultaneous request against a single site.
   */
  const finalResults = await Promise.all(
    _.shuffle(filteredData)
      .map(async (data, idx) => {
        try {
          return await cluster.execute(({page, worker})=>{
            logger.info(`${worker.id} is fetching contact: ${idx + 1} of ${filteredDataLength} rows.`);
            return handleGetCompanyDetails(page, data);
          }) as Promise<IProperty>;
        } catch (err: any) {
          logger.error(`Unhandled error at fetchingContact ${data.リンク} ${err.message}`);
          return data;
        }
      }),
  );

  const filteredJSONFname = `-finalResults-${finalResults.length.toString()}`;
  logger.info(`Done scraping contact. Saving progress to ${filteredJSONFname}`);

  // Save final result to JSON
  await saveJSON(getFileName({
    appId: kintoneAppId,
    dir: resultJSONPath,
    suffix: filteredJSONFname,
  }), finalResults);


  // Final result Output
  await saveToExcel(finalResults);


  // Save to CSV then upload to kintone
  const csvFile = await saveJSONToCSV(getFileName({
    appId: kintoneAppId,
    dir: resultCSVPath,
    suffix: `${finalResults.length.toString()}`,
  }), finalResults);
  logger.info(`Done saving to CSV. Starting to save to upload to kintone.`);
  saveMeta(intermediateResults, finalResults);

  if (csvFile) {
    try {
      await cluster.execute(({page})=> uploadTask(page, csvFile));
      logger.info(`Done uploading to kintone.`);
    } catch (err: any) {
      logger.error(`Upload to kintone might have failed. ${err.message}`);
    }
  } else {
    logger.info(`Did not upload to kintone. CSV file was empty.`);
  }


  return finalResults;
};

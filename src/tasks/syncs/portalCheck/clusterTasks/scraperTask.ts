import {resultJSONPath, kintoneAppId, resultCSVPath} from './../config';
/* eslint-disable max-len */
import {saveJSONToCSV, saveJSON, getFileName} from './../../../../utils/file';
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {IAction, IActionResult, IProperty} from '../types';
import {logger} from '../../../../utils';
import _ from 'lodash';
import {saveToExcel} from '../excelTask/saveToExcel';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import {uploadTask} from './uploadTask';
import {handleDonetCompare} from './handleDonetCompare';
import {saveMeta} from '../helpers/saveMeta';
import {saveScrapeMeta} from '../helpers/saveScrapeMeta';


type TScraperTask = (
  actions: IAction[],
  cluster: Cluster<{page: Page}>,
  saveToNetWorkDrive?: boolean,

) => Promise<IProperty[]>

export const scraperTask: TScraperTask = async (actions, cluster, saveToNetWorkDrive = true) => {
  const startTime = new Date();
  // Shuffle actions to spread network traffic between sites.
  const shuffledActions = _.shuffle(actions);


  const handleAddPropertyType = (action: IAction, dtArr: IProperty[]) => {
    return dtArr.map((dt) => ({
      ...dt,
      物件種別: action.type,
    }));
  };


  const handleAction = async (
    action: IAction,
  ): Promise<IActionResult> => {
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
            } else {
              // 失敗した場合
              throw new Error('失敗しました。');
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

      return {
        site: action.site,
        prefecture: action.pref,
        propertyType: action.type,
        isSuccess: true,
        length: dataWithType.length,
        result: dataWithType,
      };
    } catch (err: any) {
      logger.error(`Unhandled error at scraperTask.handleAction ${pref} ${type} $ ${err.message}`);
      return {
        site: action.site,
        prefecture: action.pref,
        propertyType: action.type,
        isSuccess: false,
        error: err.message,
      };
    }
  };


  /**
   * Stores all scraped properties from designated actions.
   */
  const actionResults = (await Promise.all(
    shuffledActions.map(async (action) => {
      return await handleAction(action);
    }),
  ));


  const scrapedProps = actionResults.reduce((accu, curr) => {
    if (curr.result?.length) {
      accu.push(...curr.result);
    }
    return accu;
  }, [] as IProperty[]);

  const totalScrapeLength = scrapedProps.length;
  logger.info(`Scraped results ${totalScrapeLength}. Starting to compare to doNet.`);

  /**
   * Stores properties that were collated with donetwork
   */
  const doComparedDt = await handleDonetCompare(cluster, scrapedProps);

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
      !dt.DO管理有無?.trim() ||
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
          logger.info(`Fetching contact: ${idx + 1} of ${filteredDataLength} rows.`);
          return await handleGetCompanyDetails(cluster, data);
        } catch (err: any) {
          logger.error(`Unhandled error at fetchingContact ${data.リンク} ${err.message}`);
          return {
            ...data,
            掲載企業: '処理失敗',
          };
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
  await saveToExcel(finalResults, saveToNetWorkDrive);


  // Save to CSV then upload to kintone
  const csvFile = await saveJSONToCSV(getFileName({
    appId: kintoneAppId,
    dir: resultCSVPath,
    suffix: `${finalResults.length.toString()}`,
  }), finalResults);

  saveMeta({
    beforeGetContact: doComparedDt,
    afterGetContact: finalResults,
    saveToNetWorkDrive,
    startTime,
  });
  saveScrapeMeta(actionResults, saveToNetWorkDrive);

  logger.info(`Done saving to CSV. Starting to save to upload to kintone.`);
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

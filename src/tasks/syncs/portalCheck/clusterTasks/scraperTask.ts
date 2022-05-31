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


type TScraperTask = (
  actions: IAction[], cluster: Cluster<{page: Page}>
) => Promise<IProperty[]>

export const scraperTask: TScraperTask = async (actions, cluster) => {
  // Shuffle actions to spread network traffic between sites.
  const shuffledActions = _.shuffle(actions);


  const handlePerProperty = async (action: IAction, dtArr: IProperty[]) => {
    const dtArrLength = dtArr.length;
    return await Promise.all(dtArr.map(async (dt, idx) => {
      let resultWithContact = dt;


      const doNetComparedResults = await cluster.execute(async ({page}) => {
        logger.info(`Comparing to donet at ${idx + 1 } / ${dtArrLength} items. ${dt.リンク} `);
        return await searchDoProperty(
          {page, inputData: dt},
        ) ?? {
          DO管理有無: '処理エラー',
        } as IProperty;
      }) as TSearchResult[];

      const firstComparedResult = doNetComparedResults[0];

      if (firstComparedResult.DO管理有無 === '無' ||
      (firstComparedResult.DO管理有無 === '有' && +firstComparedResult.DO価格差 !== 0)) {
        resultWithContact = await cluster.execute(async ({page}) => {
          return await action.handleContactScraper(page, dt);
        }) as IProperty;
      } else {
        logger.warn(`It already exist in doNetwork, will not retrieve contact for ${dt.リンク}`);
      }


      const completedData = {
        ...resultWithContact,
        ...firstComparedResult,
        物件種別: action.type,
      };

      logger.info(`Processed ${idx + 1 } / ${dtArrLength} items. ${dt.リンク} `);
      return completedData;
    }));
  };


  const handleAction = async (action: IAction) => {
    const {
      pref, type, handleScraper, handlePrepareForm,
    } = action;

    const initialResult : IProperty[] = await cluster
      .execute(async ({page}) => {
        const formState = await handlePrepareForm(page, pref, type);
        const res: IProperty[] = [];

        if (typeof formState === 'boolean' ) {
          if (formState) {
            res.push(...await handleScraper(page));
          }
        } else {
          // This handles edge cases where the site limits the number of cities selected. e.g. Yahoo
          while (formState.chunkLength <= formState.nextIdx) {
            if (formState.success) {
              await handlePrepareForm(page, pref, type, formState.nextIdx);
              res.push(...await handleScraper(page));
            } else {
              logger.error(`handlePrepareForm failed. ${JSON.stringify(formState)}`);
            }
          }
        }

        logger.info(`Scraped total of ${res.length} from ${page.url()}`);
        return res;
      });


    const completeData = await handlePerProperty(
      action, initialResult,
    );

    // Extract data that exist and with price difference with doNetwork.
    const filteredData = completeData.filter((dt)=>{
      if (dt.DO管理有無 === '無' ||
      (dt.DO管理有無 === '有' && +dt.DO価格差 !== 0)) {
        return true;
      }
    });

    logger.info(`Completed: ${completeData.length}, Filtered: ${filteredData.length}.`);


    // Saving file to dlPortalCheck will also trigger file watcher on another process thread.
    await saveJSONToCSV(getFileName({
      appId: kintoneAppId,
      dir: dlPortalCheck,
      suffix: `${action.type}-${filteredData.length.toString()}`,
    }), filteredData);

    return filteredData;
  };


  // Main thread emitter
  const finalResults = (await Promise.all(
    shuffledActions.map(async (action) => {
      return await handleAction(action);
    }),
  )).flatMap((res) => {
    logger.info(`Flattening ${res.length} rows.`);
    return res;
  });

  logger.info(`Final result has ${finalResults.length} rows.`);

  // Saving file to dlJSON will also trigger file watcher on another process thread.
  await saveJSON(getFileName({
    appId: kintoneAppId,
    dir: dlJSON,
    suffix: finalResults.length.toString(),
  }), finalResults);

  await saveToExcel(finalResults);

  return finalResults;
};

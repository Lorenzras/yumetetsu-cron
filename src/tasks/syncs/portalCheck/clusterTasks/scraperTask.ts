import {saveJSONToCSV, getFileName} from './../../../../utils/file';
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {TSearchResult} from '../doNetCompare/compareData';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {IAction, IProperty} from '../types';
import {dlPortalCheck, kintoneAppId} from '../config';
import {logger} from '../../../../utils';

type TScraperTask = (
  actions: IAction[], cluster: Cluster<{page: Page}>
) => Promise<void>

export const scraperTask: TScraperTask = async (actions, cluster) => {
  const handlePerProperty = async (action: IAction, dtArr: IProperty[]) => {
    return await Promise.all(dtArr.map(async (dt, idx) => {
      const resultWithContact = await cluster.execute(async ({page}) => {
        return await action.handleContactScraper(page, dt);
      }) as IProperty;

      const doNetComparedResults = await cluster.execute(async ({page}) => {
        return await searchDoProperty(
          {page, inputData: dt},
        ) ?? {
          DO管理有無: '処理エラー',
        } as IProperty;
      }) as TSearchResult[];


      return {
        ...resultWithContact,
        ...doNetComparedResults[0],
        物件種別: action.type,
      };
    }));
  };


  const handleAction = async (action: IAction) => {
    const {
      pref, type, handleScraper, handlePrepareForm,
    } = action;

    const initialResult : IProperty[] = await cluster
      .execute(async ({page}) => {
        if (await handlePrepareForm(page, pref, type)) {
          const res = await handleScraper(page);
          return res;
        }
        return [];
      });

    const completeData = await handlePerProperty(
      action, initialResult,
    );

    if (completeData.length) {
      // eslint-disable-next-line max-len
      await saveJSONToCSV(getFileName({
        appId: kintoneAppId,
        dir: dlPortalCheck,
        suffix: action.type,
      }), completeData);
    }

    return completeData;
  };

  actions.forEach(async (action) => {
    await handleAction(action);
  });
};

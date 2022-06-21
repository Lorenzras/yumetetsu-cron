
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {IAction, IProperty} from '../types';
import _ from 'lodash';
import {handleGetCompanyDetails} from './handleGetCompanyDetails';
import {handleDonetCompare} from './handleDonetCompare';

import {handleActions} from './handleActions';
import {handleSaveOutput} from './handleSaveOutput';


type TScraperTask = (
  actions: IAction[],
  cluster: Cluster<{page: Page}>,
  saveToNetWorkDrive?: boolean,

) => Promise<IProperty[]>

export const scraperTask: TScraperTask = async (
  actions, cluster,
  saveToNetWorkDrive = true,
) => {
  const startTime = new Date();
  const shuffledActions = _.shuffle(actions);
  const actionResults = await handleActions(
    cluster,
    shuffledActions,
    saveToNetWorkDrive,
  );
  const doComparedDt = await handleDonetCompare(cluster, actionResults);
  const finalResults = await handleGetCompanyDetails(cluster, doComparedDt);
  await handleSaveOutput({
    cluster,
    doComparedDt,
    finalResults,
    startTime,
    saveToNetWorkDrive,
  });

  return finalResults;
};

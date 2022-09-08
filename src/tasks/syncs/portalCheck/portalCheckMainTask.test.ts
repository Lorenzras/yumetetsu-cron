/* eslint-disable max-len */
import {scraperTask} from './clusterTasks/scraperTask';
import {browserTimeOut} from '../../common/browser/config';
import {initCluster, portalCheckMainTask} from './portalCheckMainTask';
import _ from 'lodash';
import {Cluster} from 'puppeteer-cluster';
import {Page} from 'puppeteer';
import fs from 'fs';
import path from 'path';


import {saveToExcel} from './excelTask/saveToExcel';
import {IProperty} from './types';
import {handleGetCompanyDetails} from './clusterTasks/handleGetCompanyDetails';
import {actionsHOMES} from './scrapers/scrapeHOMES';
import {actionsAtHome} from './scrapers/scrapeAtHome/actionsAtHome';
import {
  suumoActions as actionsSUUMO,
} from './scrapers/scrapeSUUMO/suumoActions';
import {
  yahooActions as actionsYahoo,
} from './scrapers/scrapeYahoo/yahooActions';
import {resultJSONPath} from './config';
import {saveMeta} from './helpers/saveMeta';
import {logger, sleep} from '../../../utils';
import {handleDonetCompare} from './clusterTasks/handleDonetCompare';
import {saveScrapeMeta} from './helpers/saveScrapeMeta';

/* const getJSONData = (fName: string) => {
  const res = fs.readFileSync(path.join(resultJSONPath, fName), 'utf8');
  return JSON.parse(res) as IProperty[];
}; */

describe('portalCheckMainProcess', () => {
  it('mainTest', async () => {
    await portalCheckMainTask(true);
    expect(true);
  }, browserTimeOut);

  it('lite', async () => {
    const cluster: Cluster<{ page: Page }> = await initCluster();

    const actions = [
      actionsHOMES()[0],
      // ...(actionsHOMES().slice(2)),
      // ...actionsAtHome(),
      // ...actionsSUUMO(),
      // ...actionsYahoo(),
      // actionsSUUMO()[2],
    ];

    await scraperTask(actions, cluster, false);
    await sleep(5000);

    await cluster.idle();
    await cluster.close();
  }, browserTimeOut);
});

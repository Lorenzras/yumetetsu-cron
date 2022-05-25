import {actionsHOMES} from './../scrapers/scrapeHOMES/actionsHOMES';

import {browserTimeOut} from '../../../common/browser/config';
import {initCluster} from '../portalCheckMainTask';
import {actionsAtHome} from '../scrapers/scrapeAtHome/actionsAtHome';
import {scraperTask} from './scraperTask';


test('scraperTask', async ()=> {
  const cluster= await initCluster();
  const actions = actionsAtHome();
  console.log(actions);
  await scraperTask(actions, cluster);

  await cluster.idle();
  await cluster.close();
}, browserTimeOut);

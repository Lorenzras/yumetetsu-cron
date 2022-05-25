import {actionsHOMES} from './../scrapers/scrapeHOMES/actionsHOMES';

import {browserTimeOut} from '../../../common/browser/config';
import {initCluster} from '../portalCheckMainTask';


test('scraperTask', async ()=> {
  const cluster= await initCluster();
  const actions = actionsHOMES();
  console.log(actions);
  // await scraperTask(actions, cluster);

  await cluster.idle();
  await cluster.close();
}, browserTimeOut);

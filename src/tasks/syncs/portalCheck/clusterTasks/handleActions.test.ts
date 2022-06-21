import {browserTimeOut} from '../../../common/browser/config';

import {actionsHOMES} from '../scrapers/scrapeHOMES';
import {actionsAtHome} from '../scrapers/scrapeAtHome/actionsAtHome';
import {
  suumoActions as actionsSUUMO,
} from '../scrapers/scrapeSUUMO/suumoActions';
import {
  yahooActions as actionsYahoo,
} from '../scrapers/scrapeYahoo/yahooActions';
import {handleActions} from './handleActions';
import {initCluster} from '../portalCheckMainTask';
import _ from 'lodash';

test('actions', async () => {
  const cluster = await initCluster();
  const actions = [
    // ...actionsHOMES(),
    ...actionsAtHome(),
    // ...actionsSUUMO(),
    // ...actionsYahoo(),
  ];

  const result = await handleActions(cluster, _.shuffle(actions), false);
  await cluster.idle();
  await cluster.close();

  expect(result).toMatchSnapshot();
}, browserTimeOut);

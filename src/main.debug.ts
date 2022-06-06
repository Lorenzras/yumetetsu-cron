// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {remindOnLongtermCust} from './tasks';
import {syncDoNetCust} from './tasks/syncs';
import {
  portalCheckMainTask,
} from './tasks/syncs/portalCheck/portalCheckMainTask';


/**
 * Portal Check.
 *
 * At 04:00.
 */
cron.schedule('20 9 * * *', () => portalCheckMainTask());

/**
 * Still alive log.
 */
// cron.schedule('*/5 * * * * *', ()=> notifyDev(formattedTime() + ': Alive'));


// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {remindOnLongtermCust} from './tasks';
import {syncDoNetCust} from './tasks/syncs/';
import {
  portalCheckMainTask,
} from './tasks/syncs/portalCheck/portalCheckMainTask';
import {logger} from './utils';
import {cronOptions} from './config/index';
import {syncDonetToKasika} from './tasks/syncs/kashika/syncDonetToKasika';


/**
 * Reminds about longterm customers every day at 9:30 am
 */
cron.schedule('30 9 * * *', remindOnLongtermCust, cronOptions);

/**
 * Full sync donet customers to kintone.
 *
 * At 20:00 on Sunday.
 */
cron.schedule('0 20 * * Sun', () => syncDoNetCust(true), cronOptions);

/**
 * Diff sync donet customers to kintone.
 *
 * At every 30th minute past
 * every hour from 8 through 19
 * on every day-of-week from Monday through Saturday.
 */
cron.schedule('*/30 8-19 * * 1-6', () => syncDoNetCust());

/**
 * Portal Check.
 *
 * At 0:30.
 */
cron.schedule('30 0 * * *', () => portalCheckMainTask(), cronOptions);


/**
 * Sync donet customers to kasika
 * everyday at 6:30am
 */
cron.schedule('20 9 * * *', syncDonetToKasika, cronOptions);


logger.info('MAIN CRON PROCESS RUNNING.');

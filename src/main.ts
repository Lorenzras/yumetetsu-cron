// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {remindOnLongtermCust} from './tasks';
import {syncDoNetCust} from './tasks/syncs/';
import {
  portalCheckMainTask,
} from './tasks/syncs/portalCheck/portalCheckMainTask';


const options = {
  scheduled: true,
  timezone: 'Asia/Tokyo',
};

/**
 * Reminds about longterm customers every day at 9:30 am
 */
cron.schedule('30 9 * * *', remindOnLongtermCust, options);

/**
 * Full sync donet customers to kintone.
 *
 * At 22:00 on Sunday.
 */
cron.schedule('0 22 * * Sun', () => syncDoNetCust(true), options);

/**
 * Full sync donet customers to kintone.
 *
 * At every 5th minute past every hour
 * on every day-of-week from Monday through Saturday.
 */
cron.schedule('*/10 8-19 * * 1-6', () => syncDoNetCust());

/**
 * Portal Check.
 *
 * At 22:00 everyday.
 */
cron.schedule('0 22 * * *', () => portalCheckMainTask());

/**
 * Still alive log.
 */
// cron.schedule('*/5 * * * * *', ()=> notifyDev(formattedTime() + ': Alive'));


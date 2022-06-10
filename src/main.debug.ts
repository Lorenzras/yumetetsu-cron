// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {remindOnLongtermCust} from './tasks';
import {syncDoNetCust} from './tasks/syncs';
import {
  portalCheckMainTask,
} from './tasks/syncs/portalCheck/portalCheckMainTask';

const options = {
  scheduled: true,
  timezone: 'Asia/Tokyo',
};

/**
 * Portal Check.
 *
 * At 04:00.
 */
cron.schedule('44 12 * * *', () => portalCheckMainTask(), options);

/**
 * Still alive log.
 */
// cron.schedule('*/5 * * * * *', ()=> notifyDev(formattedTime() + ': Alive'));


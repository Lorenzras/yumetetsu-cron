// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {longtermCustomer} from './tasks/reminders';


/**
 * Reminds about longterm customer every day at 9 am
 */
cron.schedule('30 9 * * * ', longtermCustomer, {
  scheduled: true,
  timezone: 'Asia/Tokyo',
});


console.log('Cron server is now running.');

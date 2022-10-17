// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {
  portalCheckMainTask,
} from '../tasks/syncs/portalCheck/portalCheckMainTask';
import {cronOptions} from '../config';
import {logger} from '../utils';


/**
 * Portal Check.
 *
 * At 0:30.
 */
cron.schedule('30 0 * * *', () => portalCheckMainTask(), cronOptions);


logger.info('Portal check process RUNNING.');

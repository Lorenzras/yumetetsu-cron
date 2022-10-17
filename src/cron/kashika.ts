// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {cronOptions} from '../config';
import {logger} from '../utils';
import {syncDonetToKasika} from '../tasks/syncs/kashika/syncDonetToKasika';


/**
 * Portal Check.
 *
 * At 0:30.
 */
cron.schedule('20 9 * * *', syncDonetToKasika, cronOptions);

logger.info('syncDonetToKasika RUNNING.');

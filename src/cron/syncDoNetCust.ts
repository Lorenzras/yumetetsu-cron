// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import cron from 'node-cron';
import {logger} from '../utils';
import {syncDoNetCust} from '../tasks';


cron.schedule('*/30 8-19 * * 1-6', () => syncDoNetCust());

logger.info('syncDoNetCust RUNNING.');

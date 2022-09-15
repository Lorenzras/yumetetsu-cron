// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import {
  portalCheckMainTask,
} from '../tasks/syncs/portalCheck/portalCheckMainTask';


portalCheckMainTask(true);

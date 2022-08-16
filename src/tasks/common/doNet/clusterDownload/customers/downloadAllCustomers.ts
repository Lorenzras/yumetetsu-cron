/* eslint-disable max-len */


import {logger} from '../../../../../utils';
import {TClusterPage} from '../../../browser/config';
import {getDonetStores} from '../../pages/customer/getDonetStores';
import {dlLimit} from './config';
import {downloadPerAgents} from './downloadPerAgents';
import {downloadPerStatus} from './downloadPerStatus';
import {downloadProcess} from './downloadProcess';
import {saveMeta} from './helper/saveMeta';

/** I avoided nesting queues to prevent process deadlock. */

/**
 * Download all customers
 *
 * @param cluster
 */
export const downloadAllCustomers = async (
  cluster: TClusterPage,
) => {
  const stores: AsyncReturnType<typeof getDonetStores> = await cluster
    .execute(({page}) => getDonetStores(page));


  // Download per store
  logger.info('Starting to download per store.');
  const dlPerStoreResult = await Promise.all(stores
    .map<ReturnType<typeof downloadProcess>>(
    ({value}) => cluster
      .execute(({page, worker: {id}}) => downloadProcess(page, {storeId: value, workerId: id})),
  ));

  await saveMeta('perStores', dlPerStoreResult.map(({count, options}) => ({count, options})));

  /* Download per agent that exceeded 4000 when downloaded by store */
  logger.info('Starting to download per agent.');
  const dlPerAgent = await Promise.all(
    dlPerStoreResult
      .filter(({count, agents}) => count > dlLimit && agents )
      .map(({options, agents = []}) => downloadPerAgents(
        cluster, options, agents,
      ))
      .flat(),
  );
  await saveMeta('perStores', dlPerAgent.map(({count, options}) => ({count, options})));

  /* Download per status that exceeded 4000 when downloaded by agent */
  logger.info('Starting to download per store.');
  const dlPerStatus = await Promise.all(
    dlPerAgent
      .filter(({count}) => count > dlLimit)
      .map(({options}) => downloadPerStatus(cluster, options))
      .flat(),
  );
  await saveMeta('perStatus', dlPerStatus.map(({count, options}) => ({count, options})));
};

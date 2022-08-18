/* eslint-disable max-len */


import {storeSettings} from '../../../../../config';
import {logger} from '../../../../../utils';
import {TClusterPage} from '../../../browser/config';
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
  // const stores: AsyncReturnType<typeof getDonetStores> = await cluster
  //  .execute(({page}) => getDonetStores(page));
  const stores = Object.entries(storeSettings)
    .filter(([, setting]) => ('email' in setting))
    .map(([key, {name}]) => {
      return {
        text: name,
        storeId: key,
      };
    });


  // Download per store
  logger.info('Starting to download per store.');
  const dlPerStoreResult = await Promise.all(stores
    .map<ReturnType<typeof downloadProcess>>(
    ({storeId}) => cluster
      .execute(({page, worker: {id}}) => downloadProcess(page, {storeId: storeId, workerId: id})),
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

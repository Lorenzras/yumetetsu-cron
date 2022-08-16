/* eslint-disable max-len */
import {TClusterPage} from '../../../browser/config';
import {getDonetStores} from '../../pages/customer/getDonetStores';
import {downloadProcess} from './downloadProcess';

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

  console.log(stores);
  const dlPerStoreResult = await Promise.all(
    stores.map<ReturnType<typeof downloadProcess>>(({value}) => cluster
      .execute(({page}) => downloadProcess(page, {storeId: value}))),
  );

  console.log(dlPerStoreResult);
};

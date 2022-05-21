import {getStores} from '../getStores';
import {IConcurrentData} from './../types';
import {Cluster} from 'puppeteer-cluster';


/**
 * DoNet has 4000 limit so have to limit search should this exeed.
 * Here is the filter.
 * - Search by store,
 * - Search by type,
 * - Search by status,
 * - search by agent
*/


export const downloadPerStore = async (
  cluster: Cluster<IConcurrentData>,
) => {
  const stores : string[] = await cluster.execute(getStores);

  console.log(stores);

  const handleDlByStore = (store: string) => {
    cluster.execute({
      store: store,
    });
  };

  stores.map(handleDlByStore);


  /* for (const store of stores) {
    cluster.execute({
      store: store,
    });
  } */
};

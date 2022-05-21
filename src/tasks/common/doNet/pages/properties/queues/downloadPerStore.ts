import {getStores} from '../getStores';
import {IConcurrentData} from './../types';
import {Cluster} from 'puppeteer-cluster';
export const downloadPerStore = async (
  cluster: Cluster<IConcurrentData>,
) => {
  const stores : string[] = await cluster.execute(getStores);

  console.log(stores);


  for (const store of stores) {
    cluster.execute({
      store: store,
    });
  }
};

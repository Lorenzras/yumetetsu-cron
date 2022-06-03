import {browserTimeOut} from '../../../common/browser/config';
import {initCluster} from '../portalCheckMainTask';
import {IProperty} from '../types';
import {handleDonetCompare} from './handleDonetCompare';
import dtArr from './test/199-20220531-063130-XVAu1.json';


test('compare', async ()=>{
  const cluster = await initCluster();
  const result = await handleDonetCompare(cluster, dtArr as IProperty[]);


  console.log(result.length);

  expect(result).toMatchSnapshot();
  await cluster.idle();
  await cluster.close();
}, browserTimeOut);

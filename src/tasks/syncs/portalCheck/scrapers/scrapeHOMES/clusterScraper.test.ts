import {browserTimeOut} from '../../../../common/browser/config';
import {clusterScraper} from './clusterScraper';

test('cluster', async ()=>{
  const result = await clusterScraper();
  expect(result).toMatchSnapshot();
}, browserTimeOut);


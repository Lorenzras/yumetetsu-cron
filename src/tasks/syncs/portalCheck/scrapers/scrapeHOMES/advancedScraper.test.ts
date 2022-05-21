import {browserTimeOut} from './../../../../common/browser/config';
import {advancedScraper} from './advancedScraper';
test('advancedScraper', async ()=>{
  expect(await advancedScraper());
}, browserTimeOut);

import {browserTimeOut} from './../../../browser/config';
import {concurrentScrapper} from './concurrentScraper';
test('Concurrent Scraper', async ()=>{
  await concurrentScrapper();
}, browserTimeOut);

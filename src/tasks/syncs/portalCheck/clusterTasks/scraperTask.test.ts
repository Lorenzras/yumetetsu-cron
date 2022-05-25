import {browserTimeOut} from '../../../common/browser/config';
import {initCluster} from '../portalCheckMainProcess';
import {
  handlePrepareForm, handleScraper, handleContactScraper,
} from '../scrapers/scrapeHOMES';
import {scraperTask} from './scraperTask';

test('scraperTask', async ()=> {
  const cluster= await initCluster();
  await scraperTask([
    {
      pref: '愛知県',
      type: '中古戸建',
      handleContactScraper: handleContactScraper,
      handlePrepareform: handlePrepareForm,
      handleScraper: handleScraper,
    },

  ], cluster);

  await cluster.idle();
  await cluster.close();
}, browserTimeOut);

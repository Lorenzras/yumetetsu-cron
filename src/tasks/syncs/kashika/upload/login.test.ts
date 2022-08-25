
import {createScheduler} from 'tesseract.js';
import {storeSettings, TStoreSettingsItem} from '../../../../config';
import {openBrowserPage} from '../../../common/browser';
import {ocrWorker} from '../config';

import {login} from './login';

describe('kashika', ()=>{
  it('should be able to login kashika', async ()=>{
    // const page = await openMockBrowserPage();
    const page = await openBrowserPage({
      slowMo: 40,
      headless: false,
      loadImages: true,
    });

    const worker = await ocrWorker();

    for (const [store, auth] of Object.entries(storeSettings)) {
      const scheduler = createScheduler();

      for (let i = 0; i < 5; i++ ) {
        scheduler.addWorker(await ocrWorker());
      }

      await login(
        await (await page.browser().createIncognitoBrowserContext())
          .newPage(),
        scheduler,
        auth as TStoreSettingsItem,
        99,
      );


      console.log('Success', store);
    }

    // await page.click('button[type=submit]');
    // await page.waitForNavigation();
    // const el = await page.$('div[role=alert]');
    // console.log(!el);

    // page.browser().disconnect();
    await page.close();
    await worker.terminate();
  }, 3000000);
});

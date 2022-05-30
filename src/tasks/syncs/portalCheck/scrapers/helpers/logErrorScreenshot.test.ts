import {initCluster} from './../../portalCheckMainTask';
import retry from 'async-retry';
import {openBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {logErrorScreenshot} from './logErrorScreenshot';

test('log', async ()=>{
  const cluster = await initCluster();

  const result = await retry(async (bail, attempts)=>{
    return await cluster.execute(()=>{
      if (attempts >= 3 ) {
        return 'Successfully failed';
      } else {
        throw new Error('intended error');
      }
    });
  }, {
    retries: 3,
    onRetry: (e, attempts) =>{
      console.error(e.message, attempts);
      return 'hey';
    },
  });

  console.log(result);
  /* try {
    await page.goto('https://suumo.jp/tokai/');
    throw new Error('わざとエラー');
  } catch (err: any) {
    await logErrorScreenshot(page, `Test image ${err.message}` );
  } finally {
    await page.close();
  } */
  await cluster.idle();
  await cluster.close();
  expect('');
}, browserTimeOut);

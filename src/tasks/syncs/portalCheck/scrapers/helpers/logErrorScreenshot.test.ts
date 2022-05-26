import {openBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {logErrorScreenshot} from './logErrorScreenshot';

test('log', async ()=>{
  const page = await openBrowserPage();
  try {
    await page.goto('https://suumo.jp/tokai/');
    throw new Error('わざとエラー');
  } catch (err: any) {
    await logErrorScreenshot(page, `Test image ${err.message}` );
  } finally {
    await page.close();
  }

  expect('');
}, browserTimeOut);

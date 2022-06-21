import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {IHouse, TProperty} from '../../types';
import {handlePrepareForm} from './handlePrepareForm';
import {scrapeDtHouse} from './scrapeDtHouse';

test('prepareForm', async () => {
  const page = await openBrowserPage();
  let result: IHouse[] = [];
  for (const [pref, propType] of ([
    ['愛知県', '中古戸建'],
    // ['岐阜県', '土地'],
    // ['岐阜県', '中古マンション'],
  ] as [string, TProperty ][])) {
    await handlePrepareForm(page, pref, propType);
    result = await scrapeDtHouse(page);
  }

  // page.browser().disconnect();

  await page.waitForTimeout(3000);
  await page.close();

  expect(result).toMatchSnapshot();
}, browserTimeOut);

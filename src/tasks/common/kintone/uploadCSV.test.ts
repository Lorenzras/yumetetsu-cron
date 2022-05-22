/* eslint-disable max-len */
import {APP_IDS} from '../../../api/kintone';
import {openBrowserPage, openMockBrowserPage} from '../browser';
import {browserTimeOut} from '../browser/config';
import {attachFile, uploadCSV, uploadSingleCSVSmart} from './uploadCSV';

describe('CSV', ()=>{
  it('is attached', async ()=> {
    console.log('CSV test');
    const page = await openMockBrowserPage();
    await attachFile(page, 'test.csv');

    page.browser().disconnect();
  });
});

describe('Upload', ()=>{
  it('is done.', async ()=>{
    const page = await openBrowserPage();
    console.log('Upload test');
    await uploadCSV(
      page,
      APP_IDS.customers,
      'custId' as keyof CustomersType,
    );
    await page.waitForTimeout(5000);

    expect(await page.close()).toMatchSnapshot();
  }, browserTimeOut);

  it('uploadSmart', async ()=>{
    const page = await openBrowserPage();

    await uploadSingleCSVSmart({
      page,
      fileWithAppId: '/Users/lorenzras/Documents/GitHub/yumetetsu-cron/src/tasks/common/kintone/137-20220522-095323-QQfUF.csv',
      keyField: 'propertyId',
    }).catch();

    await page.close();
  }, browserTimeOut);
});


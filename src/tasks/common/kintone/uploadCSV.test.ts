import {APP_IDS} from '../../../api/kintone';
import {openBrowserPage, openMockBrowserPage} from '../browser';
import {browserTimeOut} from '../browser/config';
import {attachFile, uploadCSV} from './uploadCSV';

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
});


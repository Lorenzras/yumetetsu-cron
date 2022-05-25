import {selectByText, searchDoProperty} from './searchDoProperty';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';

describe('form', ()=>{
  test('search', async () => {
    const page = await openMockBrowserPage();
    await Promise.all([
      page.waitForNavigation(),
      page.click('.sidebar-estate'),
    ]);

    const result = (await searchDoProperty({page, data: {
      address: '岐阜県大垣市水源町６丁目1-65　',
      area: '76.83',
      price: '1600',
      propertyType: '中古マンション',
    }}))[0];

    page.browser().disconnect();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);

  test('selectPref', async ()=>{
    // location modal must be open.
    const page = await openMockBrowserPage();
    await selectByText(page, '#select_pref_id', '岐阜県');
    page.browser().disconnect();
  });
});


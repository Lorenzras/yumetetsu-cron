/* eslint-disable max-len */
import {setParams} from '../../../../../utils/uri';
import {browserTimeOut} from './../../../browser/config';
import {openMockBrowserPage} from './../../../browser/openBrowser';
import {downloadTask} from './downloadTask';


describe('download task', ()=>{
  test('main', async ()=>{
    const page = await openMockBrowserPage();
    await downloadTask({
      page,
      data: {store: '1155'},
    });

    page.browser().disconnect();
  }, browserTimeOut);

  test('fetch', async ()=>{
    const page = await openMockBrowserPage();
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
      if (request.resourceType() === 'image') {
        return request.abort();
      }
      if (request.url().includes('filter') && !request.url().includes('google-analytics')) {
        const newPostData = setParams(
          request.postData() || '',
          [{
            field: 'm_estate_filters[fc_shop_id]',
            val: '270',
          }],
        );

        // m_estate_filters[town_id1]
        // m_estate_filters[pref_area_id1]
        // m_estate_filters[city_id1]
        console.log(request.postData());

        return request.continue({
          method: 'POST',
          postData: newPostData,
          headers: {
            ...request.headers(),
          },
        });
      }
      request.continue(); // send request without manipulation.
    });


    await page.waitForTimeout(10000);
    page.browser().disconnect();


    expect(true);
  }, browserTimeOut);
});

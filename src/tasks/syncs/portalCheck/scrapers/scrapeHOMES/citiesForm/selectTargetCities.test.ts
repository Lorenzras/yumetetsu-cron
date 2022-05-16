import {openMockBrowserPage} from '../../../../../common/browser';
import {browserTimeOut} from '../../../../../common/browser/config';
import {cityLists} from '../../../config';
import {selectTargetCities} from './selectTargetCities';

// sample link: https://www.homes.co.jp/kodate/chuko/aichi/city/


test('target cities selected', async ()=>{
  const page = await openMockBrowserPage();

  await selectTargetCities(page, cityLists['愛知']);
  page.browser().disconnect();
}, browserTimeOut);

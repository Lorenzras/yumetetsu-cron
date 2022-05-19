import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtHouse} from './scrapeDtHouse';

test(('scrapeDtHouse'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeDtHouse(page);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

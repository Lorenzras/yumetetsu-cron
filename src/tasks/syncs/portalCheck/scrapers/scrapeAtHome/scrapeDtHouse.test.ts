import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtHouse} from './scrapeDtHouse';

// https://www.athome.co.jp/kodate/chuko/aichi/komaki-city/list/

describe('House', () => {
  it('all', async () => {
    const page = await openMockBrowserPage();
    const result = await scrapeDtHouse(page);
    expect(result).toMatchSnapshot();
    console.log(result.length);
    page.browser().disconnect();
  }, browserTimeOut);
} );

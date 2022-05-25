import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {handlePrepareForm} from './handlePrepareForm';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot, scrapeDtLotPage} from './scrapeDtLot';

// https://www.athome.co.jp/tochi/aichi/anjo-city/list/

describe('Lot', () => {
  it('all', async () => {
    const page = await openMockBrowserPage();
    await handlePrepareForm(page, '愛知県', '土地');
    const result = await scrapeDtLot(page);
    expect(result).toMatchSnapshot();
    console.log(result.length);
    page.browser().disconnect();
  }, browserTimeOut);

  it('page', async () => {
    const page = await openMockBrowserPage();
    const result = await scrapeDtLotPage(page);
    expect(result).toMatchSnapshot();
    console.log(result.length);
    page.browser().disconnect();
  }, browserTimeOut);
} );

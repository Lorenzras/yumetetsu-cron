import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {downloadError} from './downloadError';
import {mapField} from './mapField';


describe('downloadError', ()=>{
  it('should download error', async ()=>{
    const page = await openMockBrowserPage();

    await downloadError(page, '1343' );

    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);
});

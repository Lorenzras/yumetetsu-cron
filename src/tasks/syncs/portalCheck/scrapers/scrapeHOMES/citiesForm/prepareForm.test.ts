import {browserTimeOut} from './../../../../../common/browser/config';
import {cityLists} from './../../../config';
import {changePublishedRange, prepareForm} from './prepareForm';
import {openMockBrowserPage} from './../../../../../common/browser/openBrowser';

describe('Form', ()=>{
  test('main', async ()=>{
    const page = await openMockBrowserPage();
    await prepareForm(page, cityLists.愛知);
    page.browser().disconnect();
  }, browserTimeOut);

  test('publishedRange', async ()=>{
    const page = await openMockBrowserPage();
    await changePublishedRange(page);
    page.browser().disconnect();
  }, browserTimeOut );
});

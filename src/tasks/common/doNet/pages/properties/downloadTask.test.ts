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
});

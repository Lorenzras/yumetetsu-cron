import {browserTimeOut} from './../../../browser/config';
import {openMockBrowserPage} from './../../../browser/openBrowser';
import {downloadTask} from './downloadTask';

test('download task', async ()=>{
  const page = await openMockBrowserPage();
  await downloadTask({
    page,
    data: {store: '1155'},
  });

  page.browser().disconnect();
}, browserTimeOut);

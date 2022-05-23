import {openMockBrowserPage} from '../../browser';
import {browserTimeOut} from '../../browser/config';
import {dlPathDonetProperty} from '../pages/properties/config';
import {handleDownload} from './handleDownload';

describe('Download', ()=> {
  it('is successful', async ()=>{
    const page = await openMockBrowserPage();
    console.log(dlPathDonetProperty);
    const result = await handleDownload(
      {
        page,
        appId: '111',
        downloadDir: dlPathDonetProperty,
        requestURL: 'https://manage.do-network.com/estate/ListCsvDownload',
      },
    );

    page.browser().disconnect();

    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

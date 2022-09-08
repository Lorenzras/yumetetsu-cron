import path from 'path';
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
        downloadDir: path.join(__dirname, '__snapshots__' ),
        encoding: 'shift_jis',
        // requestURL: 'https://manage.do-network.com/estate/ListCsvDownload',
        requestURL: 'https://manage.do-network.com/customer/ListCsvDownload',
      },
    );

    page.browser().disconnect();

    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

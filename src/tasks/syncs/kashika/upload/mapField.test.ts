import path from 'path';
import {storeSettings} from '../../../../config';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {mapField} from './mapField';
import {uploadFile} from './uploadFile';


describe('map setting', ()=>{
  it('should be able map', async ()=>{
    const page = await openMockBrowserPage();

    await mapField({
      page,
      csvField: '顧客ステータス',
      store: 'ハウスドゥ！豊川八幡店',
    });

    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);
});

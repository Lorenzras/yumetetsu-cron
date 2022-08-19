import path from 'path';
import {storeSettings} from '../../../../config';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {uploadFile} from './uploadFile';


describe('upload', ()=>{
  it('should be able to login kasika and upload csv', async ()=>{
    const page = await openMockBrowserPage();
    const storeId = '1343';
    const sourceFile = path
      .join(__dirname, '__TEST__', `${storeId}.csv`);

    await uploadFile({
      page,
      sourceFile: sourceFile,
      storeId: storeId,
    });


    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);
});

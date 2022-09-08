import path from 'path';
import {storeSettings} from '../../../../config';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {uploadFile} from './uploadFile';


describe('upload', ()=>{
  it('should single csv', async ()=>{
    const page = await openMockBrowserPage();
    const storeId = '1343';
    const sourceFile = path
      .join(__dirname, '..', 'fileProcessing', 'csv', `${storeId}.csv`);

    await uploadFile({
      page,
      sourceFile: sourceFile,
      storeId: storeId,
      totalCount: 50,
    });


    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);
});

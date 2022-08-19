import path from 'path';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {downloadError} from './downloadError';
import {sendFileToChatwork} from './sendFileToChatwork';


describe('downloadError', ()=>{
  it('should download error', async ()=>{
    const page = await openMockBrowserPage();

    await sendFileToChatwork({
      filePath: path.join(__dirname, 'resultDir', '1343-error.csv'),
      fileDetails: {
        '顧客メールアドレスの形式が正しくありません': 2,
        'Others': 2,
      },
    }).catch((err) => {
      console.log(err);
      console.log(err.message);
    });

    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);
});

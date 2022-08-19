import path from 'path';
import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {downloadError} from './downloadError';
import {sendFileToChatwork} from './sendFileToChatwork';


describe('downloadError', ()=>{
  it('should download error', async ()=>{
    const page = await openMockBrowserPage();
    const cwToken = '7bc795ef967064f642aa70956cde3cad';
    const roomId = '225800073';
    await sendFileToChatwork({
      filePath: path.join(__dirname, 'resultDir', '1343-error.csv'),
      cwToken: cwToken,
      roomId: roomId,
      fileDetails: {
        '0: 顧客メールアドレスの形式が正しくありません': '1件',
      },
    }).catch((err) => {
      console.log(err);
      console.log(err.message);
    });

    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);
});

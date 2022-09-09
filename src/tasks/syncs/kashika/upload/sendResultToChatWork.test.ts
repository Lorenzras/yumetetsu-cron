import {browserTimeOut} from '../../../common/browser/config';
import {processCSV} from '../fileProcessing/processCSV';
import {sendResultToChatWork} from './sendResultToChatWork';

describe('sendResult', ()=>{
  it('should send result', async ()=>{
    const record = await processCSV();

    const result = sendResultToChatWork(record);
  }, browserTimeOut);
});

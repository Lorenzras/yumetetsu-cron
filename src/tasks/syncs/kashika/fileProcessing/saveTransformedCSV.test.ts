import {browserTimeOut} from '../../../common/browser/config';
import {processCSV} from './processCSV';
import {saveTransformedCSV} from './saveTransformedCSV';

const testData = {
  '111': [
    {'a': '1', 'b': '2', 'c': 'xx'},
    {'b': '2'},
    {'c': '3'},
  ],
  '222': [
    {'a': '1'},
    {'b': '2'},
    {'c': '3'},
  ],
};

describe('save', ()=>{
  it('should save transformed csv', async () => {
    const liveCSV = await processCSV();
    await saveTransformedCSV(liveCSV);
  }, browserTimeOut);
});

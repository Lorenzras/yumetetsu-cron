import {browserTimeOut} from '../../../common/browser/config';
import {processCSV} from './processCSV';

describe('files', () => {
  it('should combine', async () => {
    const result = await processCSV();
    // console.log('Rows : ' + result.length);
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

import {browserTimeOut} from '../../../common/browser/config';
import {processFile} from './processFile';

describe('files', () => {
  it('should combine', async () => {
    const result = await processFile();
    console.log('Rows : ' + result.length);
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

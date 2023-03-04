import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {getOptValByText} from './getOptValByText';

describe('getOptValByText', () => {
  it('should return option value', async () => {
    const page = await openMockBrowserPage();
    const prefSelectParent = await page.waitForSelector('#simplemodal-data');
    if (!prefSelectParent) throw new Error('prefSelectEl is null');
    const result = await getOptValByText(prefSelectParent, '岐阜県');
    console.log('getOptValByText :', result);
    page.browser().disconnect();
    expect(result).toBe('21');
  }, browserTimeOut);
});

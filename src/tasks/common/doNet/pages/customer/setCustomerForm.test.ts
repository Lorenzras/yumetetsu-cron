import {browserTimeOut} from '../../../browser/config';
import {openMockBrowserPage} from '../../../browser/openBrowser';
import {setCustomerForm} from './setCustomerForm';

describe('customer form', () => {
  it('should be abke to set customer form', async () => {
    const page = await openMockBrowserPage();
    await setCustomerForm(page, {
      storeId: '157',
      status: [],
    });
    page.browser().disconnect();
  }, browserTimeOut);
});

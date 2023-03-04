import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {selectByText} from './selectByText';

describe('Select by text', () => {
  it('select pref', async () => {
    const page = await openMockBrowserPage();

    await selectByText(page, `#simplemodal-data select`, '岐阜県');
    page.browser().disconnect();
  }, browserTimeOut);

  it('select city', async () => {
    const page = await openMockBrowserPage();
    const [citySelectParent] = await page
      .$x(`//th[contains(text(), '市区')]/ancestor::tr`);

    await selectByText(citySelectParent, `select`, '大垣市');
    page.browser().disconnect();
  }, browserTimeOut);
});

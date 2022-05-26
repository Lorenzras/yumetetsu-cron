import {browserTimeOut} from '../../../../common/browser/config';
import {openMockBrowserPage} from '../../../../common/browser';
import {suumoActions} from './suumoActions';

test('SUUMO', async () => {
  const page = await openMockBrowserPage();
  const result = [];
  for (const actions of suumoActions()) {
    const state = await actions
      .handlePrepareForm(page, actions.pref, actions.type);
    if (state) {
      const datas = await actions.handleScraper(page);
      for (const prop of datas) {
        result.push(await actions.handleContactScraper(page, prop));
      }
    }
  }
  await page.browser().disconnect();
  expect(result).toMatchSnapshot();
}, browserTimeOut);

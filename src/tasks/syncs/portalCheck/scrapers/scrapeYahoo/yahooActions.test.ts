import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {yahooActions} from './yahooActions';

test(('yahooActions'), async () => {
  const page = await openMockBrowserPage();
  const result = [];

  for (const actions of yahooActions()) {
    let state = {
      success: false,
      chunkLength: 1,
      nextIdx: 0,
    };
    do {
      state = await actions
        .handlePrepareForm(page, actions.pref, actions.type, state.nextIdx);
      if (state.success) {
        const datas = await actions.handleScraper(page);
        for (const prop of datas) {
          result.push(await actions.handleContactScraper(page, prop));
        }
      }
    } while (state.nextIdx < state.chunkLength);
  }

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

import {openMockBrowserPage} from '../../../../common/browser';
import {scrapeDtHouse} from './scrapeDtHouse';

describe('House', () => {
  it('all', async () => {
    const page = await openMockBrowserPage();
    const result = await scrapeDtHouse(page);
    expect(result).toMatchSnapshot();

    page.browser().disconnect();
  });
});

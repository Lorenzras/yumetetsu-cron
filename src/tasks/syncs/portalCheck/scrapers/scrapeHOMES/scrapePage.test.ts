import {openMockBrowserPage} from '../../../../common/browser';
import {scrapePage} from './scrapePage';


test('ScrapePage', async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapePage(page);
  page.browser().disconnect();
  expect(result).toMatchSnapshot();
});

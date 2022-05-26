import {openBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {webScraper} from './webScraper';

test('Scraper', async () => {
  const page = await openBrowserPage();
  const result =webScraper(
    {
      page,
      handleScraper: ()=>[],
      handleLastPage: ()=>true,
    },
  );

  console.log(result);

  await page.close();
}, browserTimeOut);

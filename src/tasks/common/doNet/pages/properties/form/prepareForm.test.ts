import {IConcurrentData} from './../types';
import {navigateToPropertyPage} from './../../navigate';
import {login} from './../../../login';
import {browserTimeOut} from './../../../../browser/config';
import {prepareForm} from './prepareForm';
import {openBrowserPage} from './../../../../browser/openBrowser';


/**
 * DoNet has a variable limit.
 * Here is the filter.
 * - Search by store,
 * - Search by type,
 * - Search by status,
 * - search by agent
*/

test('form', async ()=>{
  const page = await openBrowserPage();

  for (const setting of
    [{
      store: '416',
      propType: ['used_mansion'],

    },
    {
      store: '416',
      propType: ['used_mansion'],
      status: ['01'],
    },
    {
      store: '416',
      propType: ['used_mansion'],
      status: ['02'],
    },
    {
      store: '416',
      propType: ['used_mansion'],
      status: ['03'],
    },
    {
      store: '416',
      propType: ['used_mansion'],
      status: ['05'],
    },
    ] as IConcurrentData[]) {
    await login(page);
    await navigateToPropertyPage(page);
    await prepareForm(page, setting as IConcurrentData);
    console.log(await page.$eval('#kensakukekka .big', (el) => $(el).text()));
  }


  await page.browser().close();
}, browserTimeOut);

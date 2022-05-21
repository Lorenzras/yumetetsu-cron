import {browserTimeOut} from './../../../browser/config';
import {prepareForm} from './prepareForm';
import {openMockBrowserPage} from './../../../browser/openBrowser';


/**
 * DoNet has 4000 limit so have to limit search should this exeed.
 * Here is the filter.
 * - Search by store,
 * - Search by type,
 * - Search by status,
 * - search by agent
*/

test('form', async ()=>{
  const page = await openMockBrowserPage();
  await prepareForm(page, {
    store: '1155',
    agent: 'null',
    propType: ['new_kodate', 'jigyou'],
    status: ['保留'],
  });

  page.browser().disconnect();
}, browserTimeOut);

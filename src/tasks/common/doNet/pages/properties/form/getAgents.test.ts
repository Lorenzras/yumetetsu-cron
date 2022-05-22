import {openMockBrowserPage} from './../../../../browser/openBrowser';
import {getAgents} from './getAgents';
test('Get Agents', async ()=>{
  const page = await openMockBrowserPage();
  const result = await getAgents({page});

  expect(result).toMatchSnapshot();

  page.browser().disconnect();
});

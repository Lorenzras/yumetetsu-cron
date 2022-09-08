import {openBrowserPage} from '../../../browser';
import {browserTimeOut} from '../../../browser/config';
import {downloadProcess} from './downloadProcess';

describe('Download Process', ()=>{
  it('should be able to download', async () => {
    const page = await openBrowserPage();

    const result = await downloadProcess(page, {
      storeId: '1155',
    });
    console.log(result);

    await page.close();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});

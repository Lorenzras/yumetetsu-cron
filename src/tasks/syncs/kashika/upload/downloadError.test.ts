import {openMockBrowserPage} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {cleanCSV, downloadError} from './downloadError';
import {mapField} from './mapField';
import iconv from 'iconv-lite';
import fs from 'fs/promises';
import path from 'path';


describe('downloadError', ()=>{
  it('should download error', async ()=>{
    const page = await openMockBrowserPage();

    await downloadError(page, '1343' );

    page.browser().disconnect();
    expect(true);
  }, browserTimeOut);

  it('should clean csv', async ()=>{
    const csvText = await fs
      .readFile(path.join(__dirname, 'resultDir', '1343-error.csv'));
    const decoder = new TextDecoder('shift-jis');

    const text = decoder
      .decode(csvText);

    await cleanCSV(text);
  }, browserTimeOut);
});

/* eslint-disable max-len */
import path from 'path';
import {openBrowserPage, openMockBrowserPage} from '../../common/browser';
import {createWorker, PSM} from 'tesseract.js';

describe('kashika', ()=>{
  it('should be able to sync to kashika', async ()=>{
    const page = await openMockBrowserPage();

    // await page.type('input[type=email]', 'info@yumetetsu.jp');
    // /await page.type('input[type=password]', 'toyokawa@3320');

    const testImg = await page.$('form img');

    await testImg?.screenshot({
      path: path.join(__dirname, 'test.png'),
    });

    const worker = createWorker({
      logger: (m) => console.log(m),
    });


    await worker.load();
    await worker.loadLanguage('jpn');
    await worker.initialize('jpn');
    await worker.setParameters({
      preserve_interword_spaces: '0',
      tessedit_char_whitelist: 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ',
    });
    const {data: {text}} = await worker
      .recognize(path.join(__dirname, 'test.png'));
    console.log(text);
    await worker.terminate();

    const cleanText = text.trim().replaceAll(' ', '');
    console.log(cleanText, cleanText.length);

    if (cleanText.length === 4) {
      await page.$('input[type=email]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type('info@yumetetsu.jp');
      });

      await page.$('input[type=password]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type('toyokawa@3320');
      });
      await page.type('input[name=captcha]', cleanText, {delay: 100});
    }


    page.browser().disconnect();
  }, 300000);
});

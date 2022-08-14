/* eslint-disable max-len */
import path from 'path';
import {Page} from 'puppeteer';
import {createWorker} from 'tesseract.js';

export const login = async (page: Page) => {
  let isSuccess = false;
  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  await worker.load();
  await worker.loadLanguage('jpn');
  await worker.initialize('jpn');
  await worker.setParameters({
    preserve_interword_spaces: '0',
    // tessedit_char_whitelist: 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ',
    tessedit_char_whitelist: 'あいうえおかがきぎくぐけげこごさざしじすずせぜそぞただちぢつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゆよらりるれろわをん',
  });

  do {
    console.log('Starting login to Kashika.');
    await page.goto('https://kasika.io/login.php');
    let cleanText = '';

    console.log('Taking captcha screenshot.');
    const testImg = await page.waitForSelector('form img');
    await testImg?.screenshot({
      path: path.join(__dirname, 'test.png'),
    });


    const {data: {text, confidence, tsv}} = await worker
      .recognize(path.join(__dirname, 'test.png'));
    console.log(text);


    cleanText = text.trim().replaceAll(' ', '');
    console.log(cleanText, cleanText.length, confidence);
    console.log(tsv);

    if (cleanText.length === 4 ) {
      await page.$('input[type=email]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type('info@yumetetsu.jp');
      });

      await page.$('input[type=password]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type('toyokawa@3320');
      });

      await page.$('input[name=captcha]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type(cleanText);
      });

      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type=submit]'),
      ]);

      console.log('Done waiting for navigation.');

      isSuccess = await Promise.race([
        page.waitForSelector('div#kasika-table', {visible: true}).then(()=>true),
        page.waitForSelector('div[role=alert]', {visible: true}).then(()=>false),

      ]);
    } else {
      isSuccess = false;
    }
  } while (!isSuccess);

  await worker.terminate();
};

// failed, 92, 84, 82
// success, 94, 85, 92

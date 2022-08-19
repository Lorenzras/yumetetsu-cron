/* eslint-disable max-len */
import path from 'path';
import {Page} from 'puppeteer';
import {Worker} from 'tesseract.js';
import {TKasikaAccount} from './../config';

export const login = async (
  page: Page,
  worker: Worker,
  {email, pass}: TKasikaAccount,
) => {
  if (!email || !pass) {
    throw new Error('Please provide email and password. Check .env file.');
  }

  let isSuccess = false;

  do {
    console.log('Starting login to Kashika.');
    await page.goto('https://kasika.io/login.php', {waitUntil: 'domcontentloaded'});
    let cleanText = '';

    console.log('Taking captcha screenshot.');
    const testImg = await page.waitForSelector('form img');
    await testImg?.screenshot({
      path: path.join(__dirname, 'test.png'),
    });


    const {data: {text, confidence, tsv}} = await worker
      .recognize(path.join(__dirname, 'test.png'));

    console.log(text, 'conf: ' + confidence, 'tsv:\n' + tsv);
    cleanText = text.trim().replaceAll(' ', '');

    if (cleanText.length === 4 && confidence >= 92) {
      await page.$('input[type=email]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type(email);
      });

      await page.$('input[type=password]').then(async (input)=>{
        await input?.click({clickCount: 3});
        await input?.type(pass);
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

  // await worker.terminate();
};

// failed, 92, 84, 82, 67, 88, 56, 23, 55, 12, 6, 3, 9, 17
// success, 94, 85, 92, 81, 95, 96, 84, 95, 91, 93

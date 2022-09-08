/* eslint-disable max-len */
import path from 'path';
import {Page} from 'puppeteer';
import {Scheduler} from 'tesseract.js';
import {TStoreSettingsItem} from '../../../../config';
import fs from 'fs';
import {logger} from '../../../../utils';


export const login = async (
  page: Page,
  scheduler: Scheduler,
  {
    email,
    pass,
  }: TStoreSettingsItem,
  workerId: number,
) => {
  if (!email || !pass) {
    throw new Error('Please provide email and password. Check .env file.');
  }

  let isSuccess = false;

  do {
    console.log('Starting login to Kashika.');
    await page.goto('https://kasika.io/login.php', {waitUntil: 'domcontentloaded'});
    let cleanText = '';

    console.log('Waiting for captcha selector.');
    const testImg = await page.waitForSelector('form img', {visible: true});

    console.log('Saving captcha.');
    const testImgPath = path.join(__dirname, '__TEST__', `${workerId}.png`);
    const dir = path.dirname(testImgPath);
    fs.existsSync(dir) || fs.mkdirSync(dir, {recursive: true});

    await page.waitForTimeout(1000); // throttle by 1 second.

    console.log('Taking captcha screenshot.');
    await testImg?.screenshot({
      path: testImgPath,

    });

    console.log('Done taking screenshot.');

    // const {data: {text, confidence, tsv}} = await worker
    //  .recognize(path.join(__dirname, 'test.png'));

    const {data: {text, confidence, tsv}} = await scheduler
      .addJob('recognize', testImgPath);


    console.log(text, 'conf: ' + confidence, 'tsv:\n' + tsv);
    cleanText = text.trim().replaceAll(' ', '');

    if (cleanText.length === 4 && confidence >= 90) {
      logger.info(`Possible match ${text}`);
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

      logger.info('Clicking submit');

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

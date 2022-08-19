/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {KStoreSettings, storeSettings, TStoreSettingsItem} from '../../../../config';
import {selectByText} from '../../../../utils';
import {mapField} from './mapField';

export const uploadFile = async (
  {
    page, sourceFile, storeId,
  }: {
    page: Page,
    sourceFile: string,
    storeId: KStoreSettings,

  }) => {
  const account = storeSettings[storeId];

  /** 普段「 顧客一括登録・変更」ボタンを押したて、
   * やっと「一括アップロード」をクリックしますが、
   * ここでは直接アップロード画面に移行します。
  */
  await page.goto('https://kasika.io/customer-csv-upload?step=upload', {waitUntil: 'domcontentloaded'});


  /** ファイルをアップロード */
  const uploadInput = await page.waitForSelector('input[type="file"]')
    .catch(()=> {
      throw new Error(`Failed to find upload inpuit. Processing ${sourceFile}`);
    });
  await uploadInput?.uploadFile(sourceFile);

  /** 「存在しない担当者が指定された場合も、顧客情報を登録する」にチェックを入れる */
  await page.$eval(
    'label[for="userNotExistSkipUserRegistration"]',
    (el)=> (el as HTMLElement)?.click(),
  );

  /** 「マッピング設定に進む」をクリック */
  await Promise.all([
    page.waitForNavigation(),
    page.$eval('#submitBtn', (el)=> (el as HTMLElement)?.click()),
  ]);


  /** 顧客種別のマッピング */
  await mapField({
    page,
    csvField: '顧客種別',
    store: account.name,
  });

  /** 顧客ステータスのマッピング */
  await mapField({
    page,
    csvField: '顧客ステータス',
    store: account.name,
  });

  /** 「データをインポートする」をクリック */
  await page.click('#submitButton');
};

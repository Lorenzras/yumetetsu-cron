import {Page} from 'puppeteer';


export const prepareForm = async (page: Page, cities: string[]) =>{
  await page.evaluate((cities: string[])=>{
    cities.forEach((item)=>{
      $(`label:contains(${item})`)
        .siblings('input')
        .prop('checked', true);
    });

    $('label:contains(3日以内に公開) input').trigger('click');
  }, cities);

  await page.click('.viewResult a');
};

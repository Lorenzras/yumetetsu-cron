import {Page} from 'puppeteer';

export const selectTargetCities = async (
  page: Page,
  cities: string[],
) => {
  await page.evaluate((cities)=>{
    $('input[id*=\'city\'] ~ label')
      .each((_, item)=>{
        const isInCityList = cities.includes($(item).children('a').text());
        const checkboxEl = $(item).siblings('input');

        if (isInCityList && !checkboxEl.is(':checked')) {
          checkboxEl.trigger('click');
          // Following is more efficient,
          // but click event needs to triggered to fire background process.
          // checkboxEl.prop('checked', isInCityList)
        }
      });
  }, cities);
};

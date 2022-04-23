import {Page} from 'puppeteer';


export const perCity = async (
  page: Page,
  cities: string[],
) => {
  const citySelectionURL = page.url();

  for (const city of cities) {
    console.log('City', city);

    await Promise.all([
      page.$x(`//a[text()="${city}"]`)
        .then(([cityLink]) => cityLink.click()),
      page.waitForNavigation(),
    ]);


    await page.goto(citySelectionURL, {waitUntil: 'networkidle2'});
  }
};

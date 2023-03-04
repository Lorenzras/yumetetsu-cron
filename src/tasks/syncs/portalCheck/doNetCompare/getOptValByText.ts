import {ElementHandle, Page} from 'puppeteer';

export const getOptValByText = async (
  parentSelector: Page | ElementHandle<Element>,
  text: string,
) => {
  return await parentSelector.$$eval('option', (el, text) => {
    const optionElement = el
      .find((option) => {
        return option &&
        (option as HTMLOptionElement).innerText === text;
      });

    if (!optionElement) throw new Error(`No option found for ${text}`);

    return (optionElement as HTMLOptionElement).value;
  }, text);
};

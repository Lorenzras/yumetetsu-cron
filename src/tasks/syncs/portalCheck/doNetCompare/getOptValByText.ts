import {ElementHandle, Page} from 'puppeteer';

export const getOptValByText = async (
  parentSelector: Page | ElementHandle<Element>,
  text: string,
) => {
  return await parentSelector.$$eval('option', (el, text) => {
    const optionElement = el
      .find((option) => {
        return option &&
        (option as HTMLOptionElement).innerText.includes(text as string);
      });

    return (optionElement as HTMLOptionElement)?.value ?? '';
  }, text);
};

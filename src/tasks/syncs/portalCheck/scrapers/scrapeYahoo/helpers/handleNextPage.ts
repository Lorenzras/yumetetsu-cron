import {Page} from 'puppeteer';

export const handleNextPage = async (page: Page) => {
  const hasNextPage = await page.$eval('[data-has_next_page]', (el) => {
    return JSON.parse((el as HTMLElement).dataset.has_next_page ?? 'false');
  });

  if (hasNextPage) {
    const rawPage = page.url().split('&')?.at(-1) ?? '';
    const nextPageNum = +(rawPage?.split('=').at(-1) ?? 0) + 1;
    await page.goto(page.url().replace(
      rawPage, `page=${nextPageNum}`),
    {waitUntil: 'domcontentloaded'},
    );
  }
  return hasNextPage;
};

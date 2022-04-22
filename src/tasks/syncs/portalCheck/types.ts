import {Page} from 'puppeteer';

export interface ScrapeItem {
  propertyName: string,
  price: number,
  area: string,
  address: string,
  propertyUrl: string,
}

export type ScraperFn = (page: Page, url: string) => Promise< ScrapeItem[]>

import {Page} from 'puppeteer';

export type PropertyType = '中古マンション' | '中古戸建' | '土地'

export interface ScrapeItem {
  propertyType: PropertyType,
  propertyName: string,
  price: number,
  area: number,
  address: string,
  propertyUrl: string,
}

export type ScraperFn = (page: Page, url: string) => Promise< ScrapeItem[]>

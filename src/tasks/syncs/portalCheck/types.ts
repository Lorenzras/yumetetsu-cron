/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {propertyTypes} from './config';

export type PropertyType = typeof propertyTypes[number]

export type PropertyActions = Array<{
  url: string,
  type: PropertyType,
  handleScraper: (page: Page) => Promise<IProperty[]>,
  submitSelector: string
}>

export interface IProperty {
  物件番号?: string,
  物件種別?: PropertyType,
  物件名: string,
  価格生値: string,
  価格: number,
  所在地: string,
  リンク: string,
  取得した日時?: string
}

export interface IHouse extends IProperty {
  土地面積生値: string,
  土地面積: number,
  /** 建物面積 */
  建物面積?: string,
}

export interface ILot extends IProperty {
  土地面積生値: string,
  土地面積: number,
}

export interface IMansion extends IProperty {
  間取り: string,
  専有面積生値: string,
  面積: number,
}

/**
 * @deprecated in favor of more specific typings
 */
export interface ScrapeItem {
  propertyType?: PropertyType,
  propertyName: string,
  price: string,
  lotArea?: string,
  buildingArea?: string,
  floorArea?: string,
  address: string,
  propertyUrl: string,
}

/**
 * @deprecated in favor of more specific typings
 */
export type ScraperFn = (page: Page) => Promise< ScrapeItem[]>

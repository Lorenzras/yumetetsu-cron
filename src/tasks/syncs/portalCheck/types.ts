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
  /** [site]-[propertyId] primary key if ever data will be saved to database. */
  id?: string,
  /** 物件種別 */
  propertyType?: PropertyType,
  /** 物件名 */
  propertyName: string,
  /** 価格生値 */
  rawPrice: string,
  /** 価格 */
  price: number,
  /** 所在地 */
  address: string,
  /** リンク */
  propertyUrl: string,
  /** 取得した時点 */
  retrievedDate?: string
}

export interface IHouse extends IProperty {
  /** 土地面積生値 */
  rawLotArea: string,
  /** 土地面積 */
  lotArea: number,
  /** 建物面積 */
  buildingArea?: string,
}

export interface ILot extends IProperty {
  /** 土地面積生値 */
  rawLotArea: string,
  /** 土地面積 */
  lotArea: number,
}

export interface IMansion extends IProperty {
  /** 専有面積生値 */
  rawFloorArea: string,
  /** 専有面積 */
  floorArea: number,
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

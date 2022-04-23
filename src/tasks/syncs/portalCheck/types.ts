/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {propertyTypes} from './config';

export type PropertyType = typeof propertyTypes[number]

export interface IProperty {
  /** [site]-[propertyId] primary key if ever data will be saved to database. */
  id?: string,
  /** 物件種別 */
  propertyType?: PropertyType,
  /** 物件名 */
  propertyName: string,
  /** 価格 */
  price: string,
  /** 所在地 */
  address: string,
  /** リンク */
  propertyUrl: string,
  /** 取得した時点 */
  retrievedDate?: string
}

export interface IHouse extends IProperty {
  /** 土地面積 */
  lotArea: string,
  /** 建物面積 */
  buildingArea: string,
}

export interface ILot extends IProperty {
  /** 土地面積 */
  lotArea: string,
  /** 土地面積上限 */
  lotAreaMax?: string,
  /** 価格上限 */
  priceMax?: string,
}

export interface IMansion extends IProperty {
  /** 間取り */
  layout: string,
  /** 専有面積 */
  floorArea: string,
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

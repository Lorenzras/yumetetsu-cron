/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {propertyTypes} from './config';

export type PropertyType = typeof propertyTypes[number]

export type PropertyActions = Array<{
  url: string,
  type: PropertyType,
  handleScraper: (page: Page) => Promise<IProperty[]>,
  submitSelector?: string
}>

export interface IProperty {
  物件番号?: string,
  物件種別?: PropertyType,
  物件名: string,
  販売価格: string,
  比較用価格: number,
  所在地: string,
  リンク: string,
  取得した日時?: string,
  掲載企業TEL?:string,
  掲載企業?:string,
}

export type TCompanyContact = Pick<IProperty, '掲載企業TEL' | '掲載企業'>

export interface IHouse extends IProperty {
  土地面積: string,
  比較用土地面積: number,
}

export interface ILot extends IProperty {
  土地面積: string,
  比較用土地面積: number,
}

export interface IMansion extends IProperty {
  専有面積: string,
  比較用専有面積: number,
}



/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {propertyTypes} from './config';

export type TProperty = typeof propertyTypes[number]
export type TPropertyConvert<T> = Record<TProperty, T>

/**
 * @deprecated
 */
export interface IPropertyAction {
  url: string,
  type: TProperty,
  handleScraper: (page: Page) => Promise<IProperty[]>,
  submitSelector?: string
}

/**
 * @deprecated in favor of IAction
 */
export type PropertyActions = Array<IPropertyAction>

export type THandleScraper = (page: Page) => Promise<IProperty[]>
export type THandlePrepareForm = (
  page: Page,
  pref: string,
  propType: TProperty,
  nextIdx?: number,
) => Promise<{
  success: boolean,
  chunkLength: number,
  nextIdx: number,
} | boolean>
export type THandleContactScraper = (page: Page, data: IProperty, isFetch?: boolean) => Promise<IProperty>
export type TSites = 'yahoo' | 'suumo' | 'homes' | 'athome'
export interface IAction {
  site: TSites,
  pref: string,
  type: TProperty,
  handleScraper: THandleScraper,
  handlePrepareForm: THandlePrepareForm
  handleContactScraper: THandleContactScraper
}

export interface IActionResult {
  site: TSites,
  prefecture: string,
  propertyType: TProperty,
  isSuccess: boolean,
  result?: IProperty[]
  length?: number,
  error?: string
}

export interface IProperty {
  物件番号?: string,
  物件種別?: TProperty,
  物件名: string,
  販売価格: string,
  比較用価格: number,
  所在地: string,
  リンク: string,
  掲載企業TEL?:string,
  掲載企業?:string,
  DO管理有無?:string,
  DO物件番号?:string,
  DOステータス?:string,
  DO登録価格?:string,
  DO価格差?:string,
  DO検索結果件数?:string,
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

export interface ILocations {
  [p: string] : {
    [c: string]: string
  }
}


const cityArr = [['豊橋市', '何市'], ['テスト市']];



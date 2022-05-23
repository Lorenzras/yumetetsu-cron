import path from 'path';
import {ILocations} from './types';

export const dirPortalCheck = __dirname;
export const dlPortalCheck = path.join(dirPortalCheck, 'data');
export const dlImg = path.join(dirPortalCheck, 'img');

export const kintoneAppId = 199;

export const propertyTypes = ['中古マンション', '中古戸建', '土地'] as const;

export const cityLists : ILocations = {
  愛知県:
  {
    豊川市: '豊川中央',
    豊橋市: '豊橋向山',
    蒲郡市: '蒲郡',
    高浜市: '高浜中央',
    碧南市: '高浜中央',
    安城市: '高浜中央',
    刈谷市: '高浜中央',
    西尾市: '高浜中央',
    豊田市: '豊田中央',
    みよし市: '豊田中央',
    名古屋市港区: '中川八熊',
    名古屋市昭和区: '千種大久手',
    名古屋市千種区: '千種大久手',
    名古屋市中川区: '中川八熊',
    名古屋市中村区: '中川八熊',
    名古屋市熱田区: '中川八熊',
  },
  岐阜県: {
    大垣市: '大垣',
  },
};

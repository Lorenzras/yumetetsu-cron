import {
  templatesPath,
  excelPath,
  jsonPath,
  csvPath,
} from './../../../utils/paths';
import path from 'path';
import {ILocations} from './types';
import {format} from 'date-fns';


export const appName = 'portalCheck';
export const resultJSONPath = path.join(jsonPath, appName);
export const resultCSVPath = path.join(csvPath, appName);

/**
 * @deprecated Relying on environment affects other cron process.
 */
export const excelResultPath = process.env.ENVIRONMENT === 'prod' ?
  path.join('\\\\192.168.11.150', 'Data01', '★サポート共有', '【ポータル新着物件】') :
  path.join(excelPath, appName);

export const resolveResultDir = (
  saveToNetWorkDrive = true,
) => path.join(
  saveToNetWorkDrive ?
    path.join('\\\\192.168.11.150', 'Data01', '★サポート共有', '【ポータル新着物件】') :
    path.join(excelPath, appName),
  `【JS】${format(new Date(), 'yyyy.MM.dd')}新着物件情報`);

export const resultFileTemplate = path.join(
  templatesPath, 'portalCheckTemplate.xlsx',
);

// export const dlImg = path.join(imagesPath, 'errImg');

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

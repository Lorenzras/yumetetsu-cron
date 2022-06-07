import {format} from 'date-fns';
import {logsDatedPath} from './../../../../utils/logger';
import {saveFile} from '../../../../utils';
import {IProperty} from './../types';
import path from 'path';
export const saveMeta = (
  beforeGetContact: IProperty[],
  afterGetContact: IProperty[],
) => {
  const totalLength = beforeGetContact.length;
  const resultLength = afterGetContact.length;

  // Before getting contact
  const rawDetails = beforeGetContact
    .reduce((accu, {
      DO管理有無: doNetExist,
      リンク: link,
    })=>{
      switch (doNetExist) {
        case '無': accu.doNet無 += 1;
          break;
        case '有': accu.doNet有 += 1;
          break;
        default: accu.doNetエラー += 1;
      }

      if (link.includes('athome')) accu.siteAtHome全 += 1;
      else if (link.includes('homes')) accu.siteHomes全 += 1;
      else if (link.includes('suumo')) accu.siteSuumo全 += 1;
      else if (link.includes('yahoo')) accu.siteYahoo全 += 1;
      return accu;
    }, {
      doNet無: 0,
      doNet有: 0,
      doNetエラー: 0,
      siteAtHome全: 0,
      siteHomes全: 0,
      siteSuumo全: 0,
      siteYahoo全: 0,
    });


  const processedDetails = afterGetContact.reduce((accu, {
    掲載企業TEL: tel,
    リンク: link,
  }) => {
    const isFail = !tel || tel.includes('失敗');
    const resolveCounter = (fieldPart: string) => {
      if (isFail) accu[`${fieldPart}失敗` as keyof typeof accu] += 1;
      else accu[`${fieldPart}済` as keyof typeof accu] += 1;
    };

    if (isFail) accu.企業取得失敗件数 += 1;

    if (link.includes('athome')) {
      resolveCounter('siteAtHome');
    } else if (link.includes('homes')) {
      resolveCounter('siteHomes');
    } else if (link.includes('suumo')) {
      resolveCounter('siteSuumo');
    } else if (link.includes('yahoo')) {
      resolveCounter('siteYahoo');
    }

    return accu;
  }, {
    企業取得失敗件数: 0,
    siteAtHome済: 0,
    siteHomes済: 0,
    siteSuumo済: 0,
    siteYahoo済: 0,
    siteAtHome失敗: 0,
    siteHomes失敗: 0,
    siteSuumo失敗: 0,
    siteYahoo失敗: 0,
  });

  saveFile(path.join(logsDatedPath, 'meta.json'), JSON.stringify({
    日時: format(new Date(), 'yyyy.MM.dd HH:mm:ss'),
    取得件数: totalLength,
    結果件数: resultLength,
    ...rawDetails,
    ...processedDetails,
  }) );
};

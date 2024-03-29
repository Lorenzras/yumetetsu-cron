import {resolveResultDir} from './../config';
import {format, intervalToDuration} from 'date-fns';
import {saveFile, spreadAddress} from '../../../../utils';
import {IProperty} from './../types';
import path from 'path';
import beautify from 'json-beautify';
import {hostname} from 'os';


export const saveMeta = ({
  beforeGetContact,
  afterGetContact,
  startTime,
  saveToNetWorkDrive = true,
}: {
  beforeGetContact: IProperty[],
  afterGetContact: IProperty[],
  startTime: Date,
  saveToNetWorkDrive : boolean,
},
) => {
  const totalLength = beforeGetContact.length;
  const resultLength = afterGetContact.length;

  // Before getting contact
  const rawDetails = beforeGetContact
    .reduce((accu, {
      DO管理有無: doNetExist,
      リンク: link,
      物件種別: propType = '無',
      DO価格差: priceDiff,
    })=>{
      switch (doNetExist) {
        case '無':
          accu.doNet無 += 1;
          break;
        case '有':
          if (+(priceDiff ?? 0) !== 0) {
            accu.doNet有_非同額 += 1;
          } else {
            accu.doNet有_同額 += 1;
          }
          break;
      }

      const resolveCount = (siteName: string) => {
        const siteField = accu[`${siteName}全` as keyof typeof accu];
        const currCount = siteField.件数 || 0;
        siteField.件数 = currCount + 1;

        if (propType) {
          const propTypeCount = siteField[propType] || 0;
          siteField[propType] = propTypeCount + 1;
        }
      };

      if (link.includes('athome')) resolveCount('siteAtHome');
      else if (link.includes('homes')) resolveCount('siteHomes');
      else if (link.includes('suumo')) resolveCount('siteSuumo');
      else if (link.includes('yahoo')) resolveCount('siteYahoo');
      return accu;
    }, {
      doNet無: 0,
      doNet有_非同額: 0,
      doNet有_同額: 0,
      siteAtHome全: {
        件数: 0,
      },
      siteHomes全: {
        件数: 0,
      },
      siteSuumo全: {
        件数: 0,
      },
      siteYahoo全: {
        件数: 0,
      },

    } as Record<string, any>);


  const processedDetails = afterGetContact.reduce((accu, {
    掲載企業: company,
    リンク: link,
    物件種別: propType = '無',
    所在地: address,
    DO管理有無,
  }) => {
    const isFail = !company || company.includes('失敗');
    const isGone = company?.includes('無くなった');
    const {市区} = spreadAddress(address);

    const resolveCounter = (fieldPart: string) => {
      let field = accu[`${fieldPart}済` as keyof typeof accu];
      if (isFail) field = accu[`${fieldPart}失敗` as keyof typeof accu];

      // Total Count
      const currCount = field['件数'] || 0;
      field['件数'] = currCount + 1;

      // Count per city
      const currCountJur = field[市区]?.['件数'] || 0;
      field[市区] = field[市区] ?? Object.create(null);
      field[市区]['件数'] = currCountJur + 1;

      // Set count per property type
      const currCountPropType = field[市区][propType] || 0;
      field[市区][propType] = currCountPropType + 1;
    };

    if (isFail) accu.企業取得失敗件数 += 1;
    if (isGone) {
      accu.無くなった.件数 += 1;
      const currGoneValue = accu.無くなった[市区]?.[propType] || 0;
      accu.無くなった[市区] = accu.無くなった[市区] ?? Object.create(null);
      accu.無くなった[市区][propType] = currGoneValue + 1;
    }

    if (link.includes('athome')) {
      resolveCounter('siteAtHome');
    } else if (link.includes('homes.co.jp')) {
      resolveCounter('siteHomes');
    } else if (link.includes('suumo')) {
      resolveCounter('siteSuumo');
    } else if (link.includes('yahoo')) {
      resolveCounter('siteYahoo');
    }

    if (!DO管理有無?.trim()) {
      accu.doNetエラー.件数 += 1;
      const currDonetErrVal = accu.doNetエラー[市区]?.[propType] || 0;
      accu.doNetエラー[市区] = accu.doNetエラー[市区] ?? Object.create(null);
      accu.doNetエラー[市区][propType] = currDonetErrVal + 1;
    }

    return accu;
  }, {

    siteAtHome済: {
      件数: 0,
    },
    siteHomes済: {
      件数: 0,
    },
    siteSuumo済: {
      件数: 0,
    },
    siteYahoo済: {
      件数: 0,
    },
    無くなった: {
      件数: 0,
    },
    doNetエラー: {
      件数: 0,
    },
    siteAtHome失敗: {
      件数: 0,
    },
    siteHomes失敗: {
      件数: 0,
    },
    siteSuumo失敗: {
      件数: 0,
    },
    siteYahoo失敗: {
      件数: 0,
    },
    企業取得失敗件数: 0,

  } as Record<string, any>);

  const {hours, minutes, seconds} = intervalToDuration({
    start: startTime,
    end: new Date(),
  });

  const prettyResult = beautify({
    処理時間: `${hours}時間${minutes}分${seconds}秒`,
    開始日時: format(startTime, 'yyyy.MM.dd HH:mm:ss'),
    終了日時: format(new Date(), 'yyyy.MM.dd HH:mm:ss'),
    パソコン名: hostname(),
    取得件数: totalLength,
    結果件数: resultLength,
    ...rawDetails,
    ...processedDetails,
  }, null as any, 2, 80);


  saveFile(
    path.join(resolveResultDir(saveToNetWorkDrive), 'meta.json'),
    prettyResult,
  );
};

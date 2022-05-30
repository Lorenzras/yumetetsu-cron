import {IHouse, ILot, IMansion, IProperty, TProperty} from '../types';
import Excel from 'exceljs';
import {dlExcelResult, resultFileTemplate} from '../config';
import path from 'path';
import {logger} from '../../../../utils/logger';
import {spreadAddress} from '../../../../utils';
import fs from 'fs';
import {format} from 'date-fns';

export const getGroupByCity = (items: IProperty[]) => {
  return items.reduce<Record<string, IProperty[]>>(
    (accu, curr) => {
      const {市区: city} = spreadAddress(curr.所在地);

      accu[city] = [...accu[city] ?? [], curr];
      return accu;
    },
    Object.create(null),
  );
};


export const saveFile = async (items: IProperty[], fileName: string) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(resultFileTemplate);

  const groupedByPropType = items
    .reduce<Record<
  TProperty, IProperty[] | IHouse[] | ILot[] | IMansion[]
  >>((accu, curr) => {
    if (!curr.物件種別) return accu;

    accu[curr.物件種別] = [...accu[curr.物件種別] ?? [], curr];

    return accu;
  }, Object.create(null));

  workbook.eachSheet((ws)=>{
    const wsName = ws.name as TProperty;
    const props = groupedByPropType[wsName];
    if (!props) return; // Short circuit

    const rows = (props).map((
      item,
    ) => {
      const {物件名, 販売価格, 所在地,
        リンク, DO管理有無, DO物件番号, DOステータス,
        DO登録価格, DO価格差, DO検索結果件数, 掲載企業TEL, 掲載企業} = item;

      let area = '';
      if ('土地面積' in item) {
        area = item.土地面積;
      } else if ('専有面積' in item) {
        area = item.専有面積;
      }

      return [
        物件名, 販売価格, 所在地, area,
        リンク,
        DO管理有無, DO物件番号, DOステータス,
        DO登録価格, DO価格差, DO検索結果件数, '', '',
        掲載企業, 掲載企業TEL,
      ];
    });

    ws.addRows(rows, 'i');

    rows.forEach((row, idx) => {
      ws.getCell('E' + (idx + 2) ).value = {
        formula: `=HYPERLINK("${row[4]}", "${row[4]}")`, date1904: false,
      };
    });
  });

  const saveFolder = path.join(
    dlExcelResult,
    `【JS】${format(new Date(), 'yyyy.MM.dd')}新着物件情報`);

  if (!fs.existsSync(saveFolder)) {
    fs.mkdirSync(saveFolder, {recursive: true});
  }

  await workbook.xlsx.writeFile(
    path.join(
      saveFolder,
      `${fileName}.xlsx`,
    ),
  );
};


export const saveToExcel = async (items: IProperty[]) => {
  if (!items.length) {
    logger.warning('Result is empty. Stopping saveToExcel.');
    return;
  }

  const groupByCity = getGroupByCity(items);

  for (const [city, props] of Object.entries(groupByCity)) {
    await saveFile(props, city);
  }
};
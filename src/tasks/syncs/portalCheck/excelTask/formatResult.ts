import {IProperty} from '../types';
import {Worksheet} from 'exceljs';

const minWidth = 10;
const maxWidth = 50;
const charWidth = 1.7;

export const getSite = (url: string) => {
  return ['yahoo', 'homes', 'athome', 'suumo']
    .find((s) => url.includes(s)) || 'その他';
};

const setHyperlinks = (
  {ws, rowIdx, row, props} :
  {
    ws: Worksheet,
    rowIdx: number,
    row: string[],
    props: IProperty[]
  },
) => {
  const propNameCell = ws.getCell('M' + (rowIdx + 2) );
  propNameCell.font = {
    color: {argb: '004e47cc'},
    bold: true,
    underline: true,
  };

  const portalLink = props[rowIdx].リンク;
  const site = getSite(portalLink);

  propNameCell.value = {
    formula: `=HYPERLINK("${portalLink}", "(${site}) ${row.at(-2)}")`,
    date1904: false,
  };
};

export const formatResult = (
  ws: Worksheet, rows: string[][], props: IProperty[],
) => {
  const widths: number[] = Array.from(Array(14)).fill(minWidth);
  rows.forEach((row, rowIdx) => {
    const dtRowIdx = rowIdx + 2;


    // Fill color for cells with doNet data.
    [5, 6, 7, 8, 9, 10].forEach((col)=>{
      ws.getRow(dtRowIdx).getCell(col).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'F8CBAD'},
      };
    });


    row.forEach((text, colIdx) => {
      // Adjust width based on text. Not too wide, or too narrow.
      let length = text.length * charWidth;
      length = length > maxWidth ? maxWidth : length;
      widths[colIdx] = length > widths[colIdx] ? length : widths[colIdx];


      // Border
      ws.getRow(dtRowIdx).getCell(colIdx + 1).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
      };
    });

    // Link
    setHyperlinks({
      ws, row, rowIdx, props,
    });
  });

  // set width base on longest string length of cell
  ws.columns.forEach((col, idx)=>col.width = widths[idx]);

  return ws;
};

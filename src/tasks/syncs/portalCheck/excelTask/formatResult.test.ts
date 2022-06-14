import {formatResult} from './formatResult';
import {IProperty, TProperty} from '../types';
import {getGroupByPropType, extractRows, saveExcelResult} from './saveToExcel';
import Excel from 'exceljs';
import {resultFileTemplate} from '../config';
import {browserTimeOut} from '../../../common/browser/config';
import jsonData from './test/199-20220531-063130-XVAu1.json';


test('formatExcel', async ()=>{
  // Mock
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(resultFileTemplate);
  const grouped = getGroupByPropType(jsonData as IProperty[]);
  workbook.eachSheet((ws)=>{
    const wsName = ws.name as TProperty;
    const props = grouped[wsName];
    if (!props) return; // Short circuit when it doesn't exist

    const rows = extractRows(props);

    ws.addRows(rows);


    formatResult(ws, rows, props);
  });
  // endMock

  await saveExcelResult(workbook, 'Test', jsonData.length);
}, browserTimeOut);

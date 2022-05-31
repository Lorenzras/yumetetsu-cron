import Excel from 'exceljs';
import path from 'path';

export const testExcel = async () => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, './template.xlsx'));
  // workbook.getWorksheet('Sheet1');

  workbook.eachSheet((ws)=>{
    const row = ws.addRow(['test', 'test3'], 'i');
  });

  await workbook.xlsx.writeFile(path.join(__dirname, './result.xlsx'));
};


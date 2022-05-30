import Excel from 'exceljs';
import path from 'path';

export const testExcel = async () => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, './template.xlsx'));
  // workbook.getWorksheet('Sheet1');

  workbook.eachSheet((ws)=>{
    console.log(ws.name);
  });
};


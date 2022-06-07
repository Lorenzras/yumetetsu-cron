/* eslint-disable max-len */
/* eslint-disable no-invalid-this */


import path from 'path';
import {saveCSV, saveFile} from './file';

jest.mock('fs').autoMockOn();


describe('File Processor', ()=>{
  it('has been saved.', ()=>{
    const p = path.join(__dirname, 'test.csv');
    const result = saveCSV(p, 'wewe,wewew,ewewew,ewe\nwewewe,wewewe,weweweweweasdasd,');
    expect(result).toMatchSnapshot();
  });
  it('saveFile', ()=>{
    saveFile('C:\\Users\\lenzr\\OneDrive\\Documents\\cery\\text.txt', 'hello');
  });
});



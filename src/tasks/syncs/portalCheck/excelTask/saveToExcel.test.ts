import {browserTimeOut} from '../../../common/browser/config';
import {getGroupByCity, saveToExcel} from './saveToExcel';
import jsonData from './../../../../../downloads/json/portalCheck/199-20220608-235456-N5T8V--finalResults-2426.json';
import {IProperty} from './../types';
import path from 'path';
import { resultJSONPath } from '../config';




describe('SaveToExcel', ()=>{
  test('main', async ()=>{
    console.log('Test data length ', jsonData.length);
    await saveToExcel(jsonData as IProperty[]);
  }, browserTimeOut);

  test('byCity', ()=>{
    console.log('Test data length ', jsonData.length);
    const result = getGroupByCity(jsonData as IProperty[]);
    console.log(Object.keys(result));
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});


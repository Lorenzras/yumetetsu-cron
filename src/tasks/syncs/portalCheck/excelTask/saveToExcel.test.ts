import {browserTimeOut} from '../../../common/browser/config';
import {getGroupByCity, saveToExcel} from './saveToExcel';
// eslint-disable-next-line max-len
import jsonData from './../../../../../downloads/json/portalCheck/199-20220617-134740-POJjq--finalResults-65.json';
import {IProperty} from './../types';
import path from 'path';
import {resultJSONPath} from '../config';


describe('SaveToExcel', ()=>{
  test('main', async ()=>{
    console.log('Test data length ', jsonData.length);
    await saveToExcel(jsonData as IProperty[], false);
  }, browserTimeOut);

  test('byCity', ()=>{
    console.log('Test data length ', jsonData.length);
    const result = getGroupByCity(jsonData as IProperty[]);
    console.log(Object.keys(result));
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});


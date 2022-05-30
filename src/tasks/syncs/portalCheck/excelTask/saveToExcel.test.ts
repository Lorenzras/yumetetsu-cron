import {browserTimeOut} from '../../../common/browser/config';
import {getGroupByCity, saveToExcel} from './saveToExcel';
import jsonData from './test/test.json';
import {IProperty} from './../types';

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

import {excelResultPath} from './config';
import {browserTimeOut} from './../../common/browser/config';
test('paths', ()=>{
  expect(excelResultPath).toMatchSnapshot();
}, browserTimeOut);

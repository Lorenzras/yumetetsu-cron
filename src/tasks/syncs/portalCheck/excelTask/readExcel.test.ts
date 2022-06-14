import axios from 'axios';
import {browserTimeOut} from '../../../common/browser/config';

test('test', async ()=>{
  const result = await axios({
    url: 'https://suumo.jp/chukomansion/__JJ_JJ010FJ100_arz1050z2bsz1011z2ncz197901028.html',
    method: 'GET',
  });

  console.log(result.data);
}, browserTimeOut);

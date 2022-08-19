
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

export const sendFileToChatwork = async ({
  filePath, roomId, cwToken, fileDetails,
}:
{
  fileDetails: Record<string, string>,
  filePath: string,
  roomId: string,
  cwToken: string,
},
) => {
  const formData = new FormData();
  const strFileDetails = Object.entries(fileDetails).map(([key, val]) => {
    return `${key}：${val}`;
  });
  const message = `[info][title]KASIKA: スキップされる顧客データ（エラー）[/title]
  ${strFileDetails}

  詳しくは添付のファイルをダウンロードしてください。[/info]`;

  formData.append('message', message);
  formData.append('file', fs.createReadStream(filePath));

  const url = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
  /*
  const options = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'X-ChatWorkToken': cwToken,
    },
    body: formData,
  };
*/
  const headers = {
    'Accept': 'application/json',
    'X-ChatWorkToken': cwToken,
  };


  await axios({
    method: 'post',
    url: url,
    headers: headers,
    data: formData,
  });

/*   return await fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error('error:' + err)); */
};

/* const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const formData = new FormData();

formData.append('message', 'hello');
formData.append('file', fs.createReadStream('1343.csv'));

const url = 'https://api.chatwork.com/v2/rooms/225800073/files';
const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'X-ChatWorkToken': '7bc795ef967064f642aa70956cde3cad'
  }
};

options.body = formData;

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err)); */

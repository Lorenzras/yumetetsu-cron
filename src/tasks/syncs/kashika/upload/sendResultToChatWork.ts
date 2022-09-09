import axios from 'axios';
import FormData from 'form-data';
import {storeSettings} from '../../../../config';

const roomId = '6732051';

export const sendResultToChatWork = async (
  record: Record<string, Record<string, string>[]>,
) => {
  const selfUnread = 1;

  const url = `https://api.chatwork.com/v2/rooms/${roomId}/messages`;

  let totalLength = 0;
  const content = Object.entries(record).map(([key, perStoreRecs]) => {
    const storeName = storeSettings[key as keyof typeof storeSettings].name;
    totalLength += perStoreRecs.length;
    return `${storeName}：${perStoreRecs.length}件`;
  }).join('\n');

  const message = [
    `[info][title]KASIKAアップロード[/title]`,
    content,
    `[hr]`,
    `合計：${totalLength}件`,
    `[/info]`,
  ].join('\n');


  // formData.append('message', message);
  const params = `body=${message}&self_unread=${selfUnread}`;
  const headers = {
    'Accept': 'application/json',
    'X-ChatWorkToken': process.env.CW_TOKEN,
  };

  await axios({
    method: 'post',
    url: url,
    headers: headers,
    data: params,
  });
};

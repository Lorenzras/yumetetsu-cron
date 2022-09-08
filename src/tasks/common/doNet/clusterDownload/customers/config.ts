import path from 'path';

export const dlLimit = 4000;
export const downloadDir = path.join(__dirname, 'csv');
export const metaDir = path.join(__dirname, 'meta');

export const custStatuses : TCustStatus[] = [
  '追客中', '買付(契約予定)', '契約済み', '決済済み', '中止', '他決', '自社買取', '投資家',
];


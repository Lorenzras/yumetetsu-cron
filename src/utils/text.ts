import {kanji2number} from '@geolonia/japanese-numeral';

type NumHash = {
  [key: string]: number;
}

const jaNumbers : NumHash = {
  '兆': 1000000000000,
  '億': 100000000,
  '万': 10000,
};

const jaUnits = ['億', '千万', '百万', '万', '千', '百', ''];

export const countLeadingZero = (strWithZero: string) => {
  return (strWithZero.match(/^0+/) || [''])[0].length;
};

export const decodeToSJIS = (buffer: Buffer) => {
  const decoder = new TextDecoder('shift_jis');
  return decoder.decode(buffer);
};

export const extractNumber = (str: string): number => {
  return +(str.match(/(\d+)(?:\.(\d+))?/g)
    ?.join('') || 0);
};

const getCleanNumStr = (dirtyStr: string) => {
  let cleanStr = dirtyStr.replace(/[円,]/g, '');
  const decimals = cleanStr.split('.');

  console.log('decimals', decimals);

  if (decimals.length === 1) return cleanStr;

  cleanStr = decimals.join('');

  console.log('cleanStr', cleanStr);


  return cleanStr;
};

/**
 * 漢字の値段を数字に変える
 *
 * @param dirtyStr 漢字の値段
 * @param digits 桁数
 * @returns {number} 数字
 */
export const extractPrice = (dirtyStr: string, digits = 2): number => {
  const cleanStr = getCleanNumStr(dirtyStr);

  try {
    return +((kanji2number(cleanStr) / 10000)
      .toFixed(digits)) || 0;
  } catch {
    return -1;
  }
};

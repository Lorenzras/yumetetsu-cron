import {kanji2number} from '@geolonia/japanese-numeral';

export const decodeToSJIS = (buffer: Buffer) => {
  const decoder = new TextDecoder('shift_jis');
  return decoder.decode(buffer);
};

export const extractNumber = (str: string): number => {
  return +(str.match(/(\d+)(?:\.(\d+))?/g)
    ?.join('') || 0);
};

const getCleanNumStr = (dirtyStr: string) => {
  const jaUnits = ['億', '万', '千'];
  const cleanStr = dirtyStr.replace(/[円,]/g, '');
  const decimal = cleanStr.indexOf('.');


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

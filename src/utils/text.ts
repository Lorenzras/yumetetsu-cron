import {kanji2number} from '@geolonia/japanese-numeral';

export const decodeToSJIS = (buffer: Buffer) => {
  const decoder = new TextDecoder('shift_jis');
  return decoder.decode(buffer);
};

export const extractNumber = (str: string): number => {
  return +(str.match(/(\d+)(?:\.(\d+))?/g)
    ?.join('') || '0');
};

/**
 * 漢字の値段を数字に変える
 *
 * @param str 漢字の値段
 * @param digits 桁数
 * @returns {number} 数字
 */
export const extractPrice = (str: string, digits = 2): number => {
  return +((kanji2number(str.replace('円', '')) / 10000)
    .toFixed(digits)) || 0;
};

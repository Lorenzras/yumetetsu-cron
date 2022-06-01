import {cityLists} from '../../config';

/**
 * Yahooで1回に選択できる地域の数(=分割に使用する地域数)
 */
export const numOfChoices = 10;

/**
 * 分割した市のリストを返す処理
 * @param pref 県
 * @param idx 処理回数(x回目)
 * @returns {string[]} 市のリスト
 */
export const splitCities = (pref: string, idx: number) => {
  const cities = Object.keys(cityLists[pref]);
  const baseNum = idx * numOfChoices;
  return cities.slice(baseNum, baseNum + numOfChoices);
  // console.log('対象の市', cities);
};

/**
 * 分割数を算出する処理
 * @param pref 県
 * @returns {number} 分割数
 */
export const chunkLengs = (pref: string) => {
  const tgtCities = Object.keys(cityLists[pref]);
  return tgtCities.length / numOfChoices +
    (tgtCities.length % numOfChoices) ? 1 : 0;
};

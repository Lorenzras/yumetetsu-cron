import {kanji2number} from '@geolonia/japanese-numeral';
import {cityLists} from '../tasks/syncs/portalCheck/config';
import {findPhoneNumbersInText, parsePhoneNumber} from 'libphonenumber-js';

type NumHash = {
  [key: string]: number;
}

const jaNumbers : NumHash = {
  '兆': 1000000000000,
  '億': 100000000,
  '万': 10000,
};

// const jaUnits = ['億', '千万', '百万', '万', '千', '百', ''];

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

const getCleanJaPrice = (
  dirtyStr: string,
): {
  cleanStr: string,
  computedDecimal: number
} => {
  let cleanStr = dirtyStr.replace(/[円,]/g, '');
  const splitByDecimal = cleanStr.split('.');
  let computedDecimal = 0;

  if (splitByDecimal.length > 1) {
    // self-mutate string with decimal
    splitByDecimal.forEach((val, idx) => {
      const isNum = !isNaN(+val);
      if (isNum) {
        return val;
      }
      const unit = Object.keys(jaNumbers).find((k) => val.includes(k)) || '';
      const multiplyer = jaNumbers[unit as keyof typeof jaNumbers];
      splitByDecimal[idx-1] += unit; // transfer unit to preceding number
      splitByDecimal[idx]=''; // clear the decimal part
      computedDecimal += +('.' + val.replace(unit, '')) * multiplyer;
    });
    cleanStr = splitByDecimal.join('');
  }

  return {
    cleanStr: cleanStr,
    computedDecimal,
  };
};

/**
 * 漢字の値段を数字に変える
 *
 * @param dirtyStr 漢字の値段
 * @param digits 桁数
 * @returns {number} 数字
 */
export const extractPrice = (dirtyStr: string, digits = 2): number => {
  const {cleanStr, computedDecimal} = getCleanJaPrice(dirtyStr);
  try {
    const mainNumber = +(kanji2number(cleanStr)) + computedDecimal;

    return +(mainNumber / 10000)
      .toFixed(digits) || 0;
  } catch {
    return -1;
  }
};

export const spreadAddress = (
  address: string,
) : {
  都道府県: string,
  市区: string,
  町域: string
} => {
  let newAddress = address;
  const pref = Object.keys(cityLists).find((i) => address.includes(i)) || '';
  const cities = Object.keys(cityLists[pref as keyof typeof cityLists]);
  const city = cities
    .find((i) => address.includes(i)) || '';

  newAddress = newAddress
    .replace(pref + city, '')
    .split(/[0-9０-９丁町]/, 1)[0];

  return {
    都道府県: pref,
    市区: city,
    町域: newAddress,
  };
};

export const extractTel = (dirtySource: string) => {
  const result = findPhoneNumbersInText(
    dirtySource,
    {
      defaultCountry: 'JP',
    },
  );
  return result
    .map((i) => parsePhoneNumber(i.number.number)
      .formatNational(),
    ).join(' または ');
};

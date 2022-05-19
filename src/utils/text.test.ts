import {kanji2number} from '@geolonia/japanese-numeral';
import {extractPrice} from './text';
test('extractPrice', ()=>{
  const testVals = [
    '2万',
    '２万',
    '1億3万',
    '2.15万',
    '10万',
    '23万円',
  ];
  testVals.forEach((i) => {
    const res = extractPrice(i);
    console.log(res);
    console.log('raw', kanji2number(i));
    expect(typeof res).toBe('number');
  });
});

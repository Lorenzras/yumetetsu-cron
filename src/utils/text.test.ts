import {extractNumber, extractPrice} from './text';

describe(('stringManipulation'), ()=>{
  test('extractNumber', ()=>{
    const testVals = ['222.22m2'];
    testVals.forEach((i)=>{
      const res = extractNumber(i);
      console.log('extractNumber', i, res);
    });
  });


  test('extractPrice', ()=>{
    const testVals = [
      '2万',
      '２万',
      '1億3万',
      '2.15万',
      '5.7億',
      '23.03億',
      '10万',
      '23万円',
    ];
    testVals.forEach((i) => {
      const res = extractPrice(i);
      console.log('extractPrice', i, res);
      expect(typeof res).toBe('number');
    });
  });
});


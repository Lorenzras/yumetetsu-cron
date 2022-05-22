import {extractNumber, extractPrice, spreadAddress} from './text';

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
      '1億900万円',
      '25.15万',
      '5.7億',
      '23.03億',
      '10万',
      '23万円',
      '2000.00万',
      '1,503.2万円',
      '1,503万円',
      '28,000万円',
      '未定',
      'なんとか',
    ];

    const testResult = testVals.map((i) => {
      const res = extractPrice(i);
      return [i, res];
    });

    expect(testResult).toMatchSnapshot();
  });

  test('spreadAddress', ()=>{
    const testVals = [
      '愛知県名古屋市熱田区新尾頭1丁目7-20',
      '愛知県豊川市八幡町西赤土',
      '愛知県豊川市赤坂町会下山26-76',
    ];

    const testResults = testVals.map((i)=>{
      return [i, spreadAddress(i)];
    });

    expect(testResults).toMatchSnapshot();
  });
});


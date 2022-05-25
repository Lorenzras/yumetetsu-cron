import {extractNumber, extractPrice, extractTel, spreadAddress} from './text';

describe(('stringManipulation'), ()=>{
  test('extractNumber', ()=>{
    const testVals = [
      '222.22m2',
      '600.00m² (181.49坪)',
      '284.00m² (85.90坪)',
    ];
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

  test('extractTel', ()=>{
    const testVals = [
      '※光IP電話、及びIP電話をご利用のお客様はTEL:052-361-0034へご連絡ください',
      '※携帯電話からお問合せいただいた方には、ショートメッセージ（SMS）またはLINE通知メッセージによるお問合せ内容に',
      'なんとかテクスト052-361-0034なんとかテクスト07014529707',
      '0037-633-38948',
    ];

    const testResults = testVals.map((i)=>{
      return [i, extractTel(i)];
    });

    expect(testResults).toMatchSnapshot();
  });
});


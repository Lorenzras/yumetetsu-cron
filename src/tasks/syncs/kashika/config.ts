/* eslint-disable max-len */
import {createWorker} from 'tesseract.js';

export const kasikaAccounts = {
  豊田中央:
  {
    email: process.env.KASIKA_TOYOTACHUO_EMAIL,
    pass: process.env.KASIKA_TOYOTACHUO_PASS,
  },
  豊田大林: {
    email: process.env.KASIKA_TOYOTAOBAYASHI_EMAIL,
    pass: process.env.KASIKA_TOYOTAOBAYASHI_PASS,
  },
  高浜中央: {
    email: process.env.KASIKA_TAKAHAMACHUO_EMAIL,
    pass: process.env.KASIKA_TAKAHAMACHUO_PASS,
  },
  豊川中央: {
    email: process.env.KASIKA_TOYOKAWACHUO_EMAIL,
    pass: process.env.KASIKA_TOYOKAWACHUO_PASS,

  },
  豊川八幡: {
    email: process.env.KASIKA_TOYOKAWAYAWATA_EMAIL,
    pass: process.env.KASIKA_TOYOKAWAYAWATA_PASS,
  },
  蒲郡: {
    email: process.env.KASIKA_GAMAGORI_EMAIL,
    pass: process.env.KASIKA_GAMAGORI_PASS,
  },
  豊橋向山: {
    email: process.env.KASIKA_TOYOHASHIMUKAIYAMA_EMAIL,
    pass: process.env.KASIKA_TOYOHASHIMUKAIYAMA_PASS,
  },
  豊橋藤沢: {
    email: process.env.KASIKA_TOYOHASHIFUJISAWA_EMAIL,
    pass: process.env.KASIKA_TOYOHASHIFUJISAWA_PASS,
  },
  千種大久手: {
    email: process.env.KASIKA_CHIKUSA_EMAIL,
    pass: process.env.KASIKA_CHIKUSA_PASS,
  },
  中川八熊: {
    email: process.env.KASIKA_TOYOKAWAYAWATA_EMAIL,
    pass: process.env.KASIKA_TOYOKAWAYAWATA_PASS,
  },
  大垣: {
    email: process.env.KASIKA_OGAKI_EMAIL,
    pass: process.env.KASIKA_OGAKI_PASS,
  },
};


export type TKasikaAccounts = typeof kasikaAccounts
export type KeyOfKasikaAccounts = keyof TKasikaAccounts
export type TKasikaAccount = TKasikaAccounts[KeyOfKasikaAccounts]


// OCR

export const ocrWorker = (async () =>{
  const w = createWorker({
    logger: (m) => console.log(m),
  });

  await w.load();
  await w.loadLanguage('jpn');
  await w.initialize('jpn');
  await w.setParameters({
    preserve_interword_spaces: '0',
    // tessedit_char_whitelist: 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ',
    tessedit_char_whitelist: 'あいうえおかがきぎくぐけげこごさざしじすずせぜそぞただちぢつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゆよらりるれろわをん',
  });
  return w;
}
)();


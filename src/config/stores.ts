// Kasika login settings

export const storeSettings = {
  '157': {
    name: 'ハウスドゥ  豊田中央',
    email: process.env.KASIKA_TOYOTACHUO_EMAIL,
    pass: process.env.KASIKA_TOYOTACHUO_PASS,
  },
  '270': {
    name: 'ハウスドゥ！豊川中央店',
    email: process.env.KASIKA_TOYOKAWACHUO_EMAIL,
    pass: process.env.KASIKA_TOYOKAWACHUO_PASS,
  },
  '403': {
    name: 'ハウスドゥ  豊橋向山',
    email: process.env.KASIKA_TOYOHASHIMUKAIYAMA_EMAIL,
    pass: process.env.KASIKA_TOYOHASHIMUKAIYAMA_PASS,
  },
  '416': {
    name: 'ハウスドゥ  千種大久手',
    email: process.env.KASIKA_CHIKUSA_EMAIL,
    pass: process.env.KASIKA_CHIKUSA_PASS,
  },
  '488': {
    name: 'ハウスドゥ  高浜中央',
    email: process.env.KASIKA_TAKAHAMACHUO_EMAIL,
    pass: process.env.KASIKA_TAKAHAMACHUO_PASS,
  },
  '575': {
    name: 'ハウスドゥ！豊田美里店',
  },
  '578': {
    name: 'ハウスドゥ  豊田大林',
    email: process.env.KASIKA_TOYOTAOBAYASHI_EMAIL,
    pass: process.env.KASIKA_TOYOTAOBAYASHI_PASS,
  },
  '808': {
    name: 'ハウスドゥ！豊川八幡店',
    email: process.env.KASIKA_TOYOKAWAYAWATA_EMAIL,
    pass: process.env.KASIKA_TOYOKAWAYAWATA_PASS,
  },
  '897': {
    name: 'ハウスドゥ  家・不動産買取専門店  豊橋向山',
  },
  '942': {
    name: 'ハウスドゥ  大垣',
    email: process.env.KASIKA_OGAKI_EMAIL,
    pass: process.env.KASIKA_OGAKI_PASS,
  },
  '991': {
    name: 'ハウスドゥ  中川八熊',
    email: process.env.KASIKA_YAGUMA_EMAIL,
    pass: process.env.KASIKA_YAGUMA_PASS,
  },
  '1155': {
    name: 'ハウスドゥ！蒲郡店',
    email: process.env.KASIKA_GAMAGORI_EMAIL,
    pass: process.env.KASIKA_GAMAGORI_PASS,
  },
  '1264': {
    name: 'ハウスドゥ！日進店',
  },
  '1305': {
    name: 'ハウスドゥ！豊橋岩田',
  },
  '1343': {
    name: 'ハウスドゥ  豊橋藤沢',
    email: process.env.KASIKA_TOYOHASHIFUJISAWA_EMAIL,
    pass: process.env.KASIKA_TOYOHASHIFUJISAWA_PASS,
  },
  '1561': {
    name: 'ハウスドゥ！豊田美里店',
  },
};

export type TStoreSettings = typeof storeSettings;
export type KStoreSettings = keyof TStoreSettings;
export type TStoreSettingsItem = typeof storeSettings['157']

/* Get storeIds
$("#m_customer_filters_fc_shop_id")
.find("option").toArray().reduce((curr, prev) =>{
    const storeId = $(prev).attr("value");
    const text = $(prev).text();
    console.log(storeId);
    return {...curr, [storeId]: text};
}, {}) */

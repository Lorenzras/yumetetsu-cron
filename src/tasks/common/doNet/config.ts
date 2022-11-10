import rootPath from 'app-root-path';

export const URLs = {
  login: 'https://manage.do-network.com/login/134',
};

export const selectors = {
  user: `[name='user_id']`,
  pass: `[name='password']`,
  store: '#fc_shop_id',
  login: '.btn_login',
};

export const homeSelectors = {
  custNav: '.sidebar-customer',
  propNav: '.sidebar-estate a',
};

export const downloadLimit = 2000;

export const custDlDir = rootPath.resolve('/dump/customers');

export const stores = {
  '157': 'ハウスドゥ  豊田中央',
  '270': 'ハウスドゥ！豊川中央店',
  '403': 'ハウスドゥ  豊橋向山',
  '416': 'ハウスドゥ  千種大久手',
  '488': 'ハウスドゥ  高浜中央',
  '575': 'ハウスドゥ！豊田美里店',
  '578': 'ハウスドゥ  豊田大林',
  '808': 'ハウスドゥ！豊川八幡店',
  '897': 'ハウスドゥ  家・不動産買取専門店  豊橋向山',
  '942': 'ハウスドゥ  大垣',
  '991': 'ハウスドゥ  中川八熊',
  '1155': 'ハウスドゥ！蒲郡店',
  '1264': 'ハウスドゥ！日進店',
  '1305': 'ハウスドゥ！豊橋岩田',
  '1343': 'ハウスドゥ  豊橋藤沢',
  '1561': 'ハウスドゥ！豊田美里店',
};

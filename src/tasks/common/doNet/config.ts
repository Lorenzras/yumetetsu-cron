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
};

export const downloadLimit = 4000;

export const custDlDir = rootPath.resolve('/dump/customers');

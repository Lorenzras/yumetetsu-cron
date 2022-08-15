module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
    'import',
  ],
  'rules': {
    'no-unused-vars': 'off',
    'import/no-unresolved': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    'indent': 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
    ],
    'valid-jsdoc': ['error', {
      'requireParamType': false,
      'requireParamDescription': false,
      'requireReturn': false,
    }],

  },
};

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:flowtype/recommended', 'prettier'],
  plugins: ['flowtype', 'prettier'],
  rules: {
    'comma-dangle': ['error', 'never'],
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'react/sort-comp': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'flowtype/no-types-missing-file-annotation': 'off'
  },
  env: {
    browser: true,
    es6: true
  }
};

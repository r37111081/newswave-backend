module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    semi: 1, // 結尾分號確認 [警告]
    'prefer-const': 'off', // 強制設定無改變的變數要用const宣告 [關閉]
    quotes: ['error', 'single'] // 字串的定義符號 [錯誤，單引號] - 不使用單引號就會報錯
  }
}

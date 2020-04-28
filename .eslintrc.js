module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    '@vue/prettier',
    '@vue/typescript'
  ],
  plugins: ['prettier', 'vue'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/member-delimiter-style': 0
  }
}

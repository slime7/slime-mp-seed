// ESLint 检查 .vue 文件需要单独配置编辑器：
// https://eslint.vuejs.org/user-guide/#editor-integrations
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  extends: ['plugin:vue/strongly-recommended', 'airbnb-base'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.js', '.jsx', '.vue', '.json'],
      },
    },
  },
  rules: {
    semi: ['error', 'always'],
    'semi-spacing': ['error', { before: false, after: true }],
    quotes: ['error', 'single', { avoidEscape: true }],
    indent: ['error', 2],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false,
        overrides: {},
      },
    ],
    'space-in-parens': ['error', 'never'],
    'no-unused-vars': ['error', { caughtErrors: 'none' }],
    'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],
    'import/no-commonjs': [0],
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'no-trailing-spaces': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'sort-imports': ['warn', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
    }],
    'vue/multi-word-component-names': 'off',
    'vue/html-button-has-type': 'off',
    'vue/max-len': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 5,
      },
      multiline: {
        max: 1,
      },
    }],
    'max-len': 'off',
    'no-unsafe-optional-chaining': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
    'import/no-cycle': 'warn',
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],
  },
  globals: {
    uni: 'readonly',
    plus: 'readonly',
    wx: 'readonly',
    getCurrentPages: 'readonly',
  },
  ignorePatterns: [
    'dist/**',
    '**/wxcomponents/**',
    'src/static/**',
    'src/libs/**',
  ],
};

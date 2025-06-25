/** @type {import('stylelint').Config} */
module.exports = {
  root: true,
  customSyntax: 'postcss-scss',
  extends: [
    'stylelint-config-html',
  ],
  plugins: [
    'stylelint-scss', // 必须：用于处理 SCSS 语法相关的规则
  ],
  rules: {
    indentation: 2,
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'after-single-line-comment'],
      },
    ],
    'selector-list-comma-newline-after': 'always',
    'selector-list-comma-newline-before': 'never-multi-line',
    'selector-list-comma-space-before': 'never',
    'value-list-comma-space-after': 'always',
    'declaration-empty-line-before': ['never', {}],
    'color-hex-case': 'lower',
    'length-zero-no-unit': true,
    'color-hex-length': 'short',
    'comment-whitespace-inside': 'always',
    'string-quotes': 'single',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'property-case': 'lower',
    'selector-type-case': 'lower',
    'media-feature-parentheses-space-inside': 'never',
    'block-opening-brace-space-before': 'always',
    'block-opening-brace-newline-after': 'always-multi-line',
    'block-closing-brace-newline-before': 'always-multi-line',
    'block-closing-brace-empty-line-before': 'never',
    'no-extra-semicolons': true,
    'number-leading-zero': 'never',
    'no-empty-first-line': true,
    'no-empty-source': null,
    'no-eol-whitespace': true,
    'declaration-block-semicolon-newline-after': 'always-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-block-semicolon-space-before': 'never',
    'selector-combinator-space-before': 'always',
    'selector-combinator-space-after': 'always',
  },
  overrides: [
    {
      files: ["src/**/*.{vue,html}"],
      customSyntax: "postcss-html",
    },
  ],
};

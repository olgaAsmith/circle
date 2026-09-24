/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      {
        message: 'Expected class selector to be BEM',
      },
    ],
    'custom-property-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected custom property to be kebab-case',
      },
    ],
    'keyframes-name-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
      {
        message: 'Expected keyframe name to be kebab-case',
      },
    ],
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'rule-empty-line-before': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/operator-no-newline-after': null,
    'scss/double-slash-comment-empty-line-before': null,
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'media-feature-range-notation': 'prefix',
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: [
          'background-clip',
          'line-clamp',
          'box-orient',
          'appearance',
        ],
      },
    ],
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box'],
      },
    ],
  },
};

// @ts-check
const eslint = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier/flat');
const globals = require('globals');

/** @param {string} prefix */
function selectorRules(prefix) {
  return {
    '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix, style: 'camelCase' }],
    '@angular-eslint/component-selector': ['error', { type: 'element', prefix, style: 'kebab-case' }],
  };
}

module.exports = defineConfig([
  globalIgnores(['dist/', 'out-tsc/', '.angular/', 'coverage/', 'test-results/', 'playwright-report/', 'blob-report/']),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
  },
  {
    files: ['projects/ngx-floaty/**/*.ts'],
    rules: selectorRules('floaty'),
  },
  {
    files: ['projects/demo/**/*.ts'],
    rules: selectorRules('app'),
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
]);

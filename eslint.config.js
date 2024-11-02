import { FlatCompat } from '@eslint/eslintrc'
import { default as pluginJs } from '@eslint/js'
import typeScriptESLintParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat()

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist/**']
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: { parser: typeScriptESLintParser }
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'vue/attributes-order': [
        'warn',
        {
          alphabetical: true
        }
      ],
      eqeqeq: 'error',
      'vue/eqeqeq': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: ['/@/lib/apis/generated'],
          patterns: ['../']
        }
      ],
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none'
          },
          singleline: {
            delimiter: 'semi'
          }
        }
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/require-default-prop': 'off',
      'vue/block-lang': [
        'error',
        {
          script: { lang: 'ts' }
        }
      ],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/v-on-event-hyphenation': ['error', 'always', { autofix: true }],
      'vue/v-on-function-call': 'error',
      'vue/no-template-target-blank': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/prefer-import-from-vue': 'error',
      'import/no-duplicates': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'vue/multi-word-component-names': 'warn'
    }
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  )
]

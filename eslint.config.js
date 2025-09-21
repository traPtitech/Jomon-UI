import pluginJs from '@eslint/js'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig([
  globalIgnores([
    '**/dist/**',
    'public/mockServiceWorker.js',
    'src/lib/apis/generated/**'
  ]),
  {
    files: ['src/**/*.{js,ts,tsx,vue}'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: [
      'eslint.config.js',
      'vite.config.ts',
      '**/*.config.{js,ts,mjs,cjs}',
      'scripts/**/*.{js,ts,mts,cts}'
    ],
    languageOptions: { globals: globals.node }
  },
  pluginJs.configs.recommended,
  ...defineConfigWithVueTs(
    pluginVue.configs['flat/strongly-recommended'],
    pluginVueA11y.configs['flat/recommended'],
    {
      files: ['**/*.{ts,tsx,cts,mts,vue}'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir
        }
      }
    },
    vueTsConfigs.strictTypeChecked,
    vueTsConfigs.stylisticTypeChecked,
    {
      files: ['**/*.vue'],
      rules: {
        'vue/require-default-prop': 'off',
        'vuejs-accessibility/label-has-for': [
          'error',
          {
            required: {
              some: ['nesting', 'id']
            }
          }
        ]
      }
    }
  ),
  eslintConfigPrettier
])

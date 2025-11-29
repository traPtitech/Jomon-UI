import pluginJs from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import unusedImports from 'eslint-plugin-unused-imports'
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
    'src/lib/apis/generated/**',
  ]),
  {
    files: ['src/**/*.{js,ts,tsx,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: [
      'scripts/**/*.{js,mjs,cjs,ts,mts,cts}',
      'vite.config.ts',
      'vitest.config.ts',
      '**/*.config.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.node.json',
          allowDefaultProject: ['eslint.config.js', 'vitest.config.ts'],
        },
        tsconfigRootDir,
      },
    },
  },
  pluginJs.configs.recommended,
  ...defineConfigWithVueTs(
    pluginVue.configs['flat/strongly-recommended'],
    pluginVueA11y.configs['flat/recommended'],
    {
      files: ['src/**/*.{ts,tsx,cts,mts,d.ts,vue}'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    vueTsConfigs.strictTypeChecked,
    {
      files: ['src/**/*.vue'],
      rules: {
        'vue/require-default-prop': 'off',
        'vuejs-accessibility/label-has-for': [
          'error',
          {
            required: {
              some: ['nesting', 'id'],
            },
          },
        ],
      },
    }
  ),
  {
    files: ['tests/**/*.ts'],
    ...vitest.configs.recommended,
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
        ...globals.node,
      },
    },
  },
  skipFormatting,
])

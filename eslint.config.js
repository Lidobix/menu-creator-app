import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**'],
  },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    plugins: {
      'react-native': reactNative,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      prettier: prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^\\u0000',
              '^react$',
              '^react-native$',
              '^react',
              '^@react',
              '^@?\\w',
              '^@/',
              '^\\.\\.',
              '^\\.',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'import/newline-after-import': ['error', { count: 1 }],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  configPrettier,
);

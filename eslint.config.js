import js from '@eslint/js';
// AJOUTE CET IMPORT
import tsParser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'scripts/**',
      'babel.config.js',
      'expo-env.d.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      // C'EST ÇA QUI MANQUE :
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.reactNative,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
      'react-native': reactNative,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      'no-undef': 'off', // Désactivé car TS gère déjà les variables non définies mieux que ESLint
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-require-imports': 'off',

      'prettier/prettier': 'error',
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
    },
  },
  configPrettier,
);

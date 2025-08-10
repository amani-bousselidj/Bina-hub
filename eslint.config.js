import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import next from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // Correct path to project tsconfig
        project: [
          '../tsconfig.json',
        ],
      },
      globals: {
        React: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
      prettier: prettier,
      '@next/next': next,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      // Restrict deep UI imports: enforce using '@/components/ui' barrel
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: "@/components/ui/badge", message: "Import Badge from '@/components/ui' instead." },
            { name: "@/components/ui/card", message: "Import Card from '@/components/ui' instead." }
          ],
          patterns: ["**/ui/badge", "**/ui/card"]
        }
      ]
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: [
            '../tsconfig.json',
          ],
        },
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
    ],
  },
];

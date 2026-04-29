const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const jest = require('eslint-plugin-jest');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    plugins: {
      jest: jest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'preserve-caught-error': 'off',
      ...jest.configs.recommended.rules,
    },
  },
  {
    ignores: ['node_modules/', '.adminjs/', 'dist/', 'coverage/', '.env', 'scratch/'],
  },
];

module.exports = {
  extends: '@manuscripts/eslint-config',
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'header/header': 'off',
    'simple-import-sort/sort': 'off',
    curly: 'off',
  },
  overrides: [
    {
      files: '**/*.test.ts',
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};

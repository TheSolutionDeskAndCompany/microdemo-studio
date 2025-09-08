module.exports = {
  root: true,
  extends: ['../../.eslintrc.cjs'],
  rules: {
    // Disable the rule for unused variables in type imports
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_|Demo' }
    ]
  },
  overrides: [
    {
      files: ['lib/db.ts', 'lib/prisma.ts'],
      rules: {
        // Allow var in global Prisma client pattern
        'no-var': 'off',
      }
    }
  ]
};

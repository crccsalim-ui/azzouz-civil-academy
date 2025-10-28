module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'next/typescript'],
  ignorePatterns: ['.next/*', 'out/*', 'build/*', 'next-env.d.ts'],
  rules: {
    'import/no-anonymous-default-export': 'off',
  },
};

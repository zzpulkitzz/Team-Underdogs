module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
};
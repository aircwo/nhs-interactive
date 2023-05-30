const config = {
  preset: 'ts-jest',
  // testEnvironment: 'node',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.tsx'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};

module.exports = config;


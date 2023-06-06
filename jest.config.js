const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.tsx', '<rootDir>/test/**/*.test.ts'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};

module.exports = config;

const { resolve } = require('path');

module.exports = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: './db-test-env',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^canvas$': resolve(__dirname, './src/canvas'),
    '^canvas/(.*)$': resolve(__dirname, './src/canvas/$1'),
    '^ui$': resolve(__dirname, './src/ui'),
    '^ui/(.*)$': resolve(__dirname, './src/ui/$1'),
    '^db$': resolve(__dirname, './src/db'),
    '^db/(.*)$': resolve(__dirname, './src/db/$1'),
    '^test-utils$': resolve(__dirname, './test-utils'),
    '^test-utils/(.*)$': resolve(__dirname, './test-utils/$1'),
    '^types$': resolve(__dirname, './src/types'),
    '^types/(.*)$': resolve(__dirname, './src/types/$1'),
  },
};

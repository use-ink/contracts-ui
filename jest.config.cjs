const { resolve } = require('path');

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^@canvas$': resolve(__dirname, './src/@canvas'),
    '^@canvas/(.*)$': resolve(__dirname, './src/@canvas/$1'),
    '^@common$': resolve(__dirname, './src/@common'),
    '^@common/(.*)$': resolve(__dirname, './src/@common/$1'),
    '^@db$': resolve(__dirname, './src/@db'),
    '^@db/(.*)$': resolve(__dirname, './src/@db/$1'),
  },
};

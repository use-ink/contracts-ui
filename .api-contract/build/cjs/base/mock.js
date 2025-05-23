'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.mockApi = void 0;
const types_1 = require('@polkadot/types');
const registry = new types_1.TypeRegistry();
const instantiateWithCode = () => {
  throw new Error('mock');
};
instantiateWithCode.meta = { args: new Array(6) };
exports.mockApi = {
  call: {
    contractsApi: {
      call: () => {
        throw new Error('mock');
      },
    },
  },
  isConnected: true,
  registry,
  tx: {
    contracts: {
      instantiateWithCode,
    },
  },
};

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Base = void 0;
const util_1 = require('@polkadot/util');
const index_js_1 = require('../Abi/index.js');
class Base {
  abi;
  api;
  _decorateMethod;
  _isWeightV1;
  constructor(api, abi, decorateMethod) {
    if (!api || !api.isConnected || !api.tx) {
      throw new Error(
        'Your API has not been initialized correctly and is not connected to a chain',
      );
    } else if (
      !api.tx.contracts ||
      !(0, util_1.isFunction)(api.tx.contracts.instantiateWithCode) ||
      api.tx.contracts.instantiateWithCode.meta.args.length !== 6
    ) {
      throw new Error(
        'The runtime does not expose api.tx.contracts.instantiateWithCode with storageDepositLimit',
      );
    } else if (!api.call.contractsApi || !(0, util_1.isFunction)(api.call.contractsApi.call)) {
      throw new Error(
        'Your runtime does not expose the api.call.contractsApi.call runtime interfaces',
      );
    }
    this.abi =
      abi instanceof index_js_1.Abi
        ? abi
        : new index_js_1.Abi(abi, api.registry.getChainProperties());
    this.api = api;
    this._decorateMethod = decorateMethod;
    this._isWeightV1 = !api.registry.createType('Weight').proofSize;
  }
  get registry() {
    return this.api.registry;
  }
}
exports.Base = Base;

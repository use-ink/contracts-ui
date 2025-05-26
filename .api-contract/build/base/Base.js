import { isFunction } from '@polkadot/util';
import { Abi } from '../Abi/index.js';
export class Base {
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
      !isFunction(api.tx.contracts.instantiateWithCode) ||
      api.tx.contracts.instantiateWithCode.meta.args.length !== 6
    ) {
      throw new Error(
        'The runtime does not expose api.tx.contracts.instantiateWithCode with storageDepositLimit',
      );
    } else if (!api.call.contractsApi || !isFunction(api.call.contractsApi.call)) {
      throw new Error(
        'Your runtime does not expose the api.call.contractsApi.call runtime interfaces',
      );
    }
    this.abi = abi instanceof Abi ? abi : new Abi(abi, api.registry.getChainProperties());
    this.api = api;
    this._decorateMethod = decorateMethod;
    this._isWeightV1 = !api.registry.createType('Weight').proofSize;
  }
  get registry() {
    return this.api.registry;
  }
}

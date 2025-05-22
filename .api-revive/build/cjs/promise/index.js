'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ContractPromise = exports.CodePromise = exports.BlueprintPromise = void 0;
const api_1 = require('@polkadot/api');
const index_js_1 = require('../base/index.js');
class BlueprintPromise extends index_js_1.Blueprint {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, api_1.toPromiseMethod);
  }
}
exports.BlueprintPromise = BlueprintPromise;
class CodePromise extends index_js_1.Code {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, api_1.toPromiseMethod);
  }
}
exports.CodePromise = CodePromise;
class ContractPromise extends index_js_1.Contract {
  constructor(api, abi, address) {
    super(api, abi, address, api_1.toPromiseMethod);
  }
}
exports.ContractPromise = ContractPromise;

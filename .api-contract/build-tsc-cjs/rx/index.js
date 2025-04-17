'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ContractRx = exports.CodeRx = exports.BlueprintRx = void 0;
const api_1 = require('@polkadot/api');
const index_js_1 = require('../base/index.js');
class BlueprintRx extends index_js_1.Blueprint {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, api_1.toRxMethod);
  }
}
exports.BlueprintRx = BlueprintRx;
class CodeRx extends index_js_1.Code {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, api_1.toRxMethod);
  }
}
exports.CodeRx = CodeRx;
class ContractRx extends index_js_1.Contract {
  constructor(api, abi, address) {
    super(api, abi, address, api_1.toRxMethod);
  }
}
exports.ContractRx = ContractRx;

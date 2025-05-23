'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Code = exports.CodeSubmittableResult = void 0;
exports.extendCode = extendCode;
const api_1 = require('@polkadot/api');
const util_1 = require('@polkadot/util');
const Base_js_1 = require('./Base.js');
const Blueprint_js_1 = require('./Blueprint.js');
const Contract_js_1 = require('./Contract.js');
const util_js_1 = require('./util.js');
class CodeSubmittableResult extends api_1.SubmittableResult {
  blueprint;
  contract;
  constructor(result, blueprint, contract) {
    super(result);
    this.blueprint = blueprint;
    this.contract = contract;
  }
}
exports.CodeSubmittableResult = CodeSubmittableResult;
function isValidCode(code) {
  return (0, util_1.isWasm)(code) || (0, util_1.isRiscV)(code);
}
class Code extends Base_js_1.Base {
  code;
  __internal__tx = {};
  constructor(api, abi, wasm, decorateMethod) {
    super(api, abi, decorateMethod);
    this.code = isValidCode(this.abi.info.source.wasm)
      ? this.abi.info.source.wasm
      : (0, util_1.u8aToU8a)(wasm);
    if (!isValidCode(this.code)) {
      throw new Error('Invalid code provided');
    }
    this.abi.constructors.forEach(c => {
      if ((0, util_1.isUndefined)(this.__internal__tx[c.method])) {
        this.__internal__tx[c.method] = (0, util_js_1.createBluePrintTx)(c, (o, p) =>
          this.__internal__instantiate(c, o, p),
        );
      }
    });
  }
  get tx() {
    return this.__internal__tx;
  }
  __internal__instantiate = (
    constructorOrId,
    { gasLimit = util_1.BN_ZERO, salt, storageDepositLimit = null, value = util_1.BN_ZERO },
    params,
  ) => {
    console.log('in instantiate');
    console.log(this.abi.info.source.wasmHash);
    return this.api.tx.revive
      .instantiateWithCode(
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1
          ? (0, util_js_1.convertWeight)(gasLimit).v1Weight
          : (0, util_js_1.convertWeight)(gasLimit).v2Weight,
        storageDepositLimit,
        (0, util_1.compactAddLength)(this.code),
        this.abi.findConstructor(constructorOrId).toU8a(params),
        (0, util_js_1.encodeSalt)(salt),
      )
      .withResultTransform(
        result =>
          new CodeSubmittableResult(
            result,
            new Blueprint_js_1.Blueprint(
              this.api,
              this.abi,
              this.abi.info.source.wasmHash,
              this._decorateMethod,
            ),
            new Contract_js_1.Contract(
              this.api,
              this.abi,
              '0x075e2a9cfb213a68dfa1f5cf6bf6d515ae212cf8',
              this._decorateMethod,
            ),
          ),
      );
  };
}
exports.Code = Code;
function extendCode(type, decorateMethod) {
  return class extends Code {
    static __CodeType = type;
    constructor(api, abi, wasm) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}

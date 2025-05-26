'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CodeRevive = exports.CodeReviveSubmittableResult = void 0;
exports.extendCode = extendCode;
const api_1 = require('@polkadot/api');
const util_1 = require('@polkadot/util');
const BaseRevive_js_1 = require('./BaseRevive.js');
const BlueprintRevive_js_1 = require('./BlueprintRevive.js');
const Contract_js_1 = require('./Contract.js');
const util_js_1 = require('./util.js');
class CodeReviveSubmittableResult extends api_1.SubmittableResult {
  blueprint;
  contract;
  constructor(result, blueprint, contract) {
    super(result);
    this.blueprint = blueprint;
    this.contract = contract;
  }
}
exports.CodeReviveSubmittableResult = CodeReviveSubmittableResult;
function isValidCode(code) {
  return (0, util_1.isRiscV)(code);
}
class CodeRevive extends BaseRevive_js_1.BaseRevive {
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
          new CodeReviveSubmittableResult(
            result,
            new BlueprintRevive_js_1.BlueprintRevive(
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
exports.CodeRevive = CodeRevive;
function extendCode(type, decorateMethod) {
  return class extends CodeRevive {
    static __CodeType = type;
    constructor(api, abi, wasm) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}

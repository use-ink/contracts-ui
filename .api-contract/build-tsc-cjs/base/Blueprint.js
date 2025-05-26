'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Blueprint = exports.BlueprintSubmittableResult = void 0;
exports.extendBlueprint = extendBlueprint;
const api_1 = require('@polkadot/api');
const util_1 = require('@polkadot/util');
const util_js_1 = require('../util.js');
const Base_js_1 = require('./Base.js');
const Contract_js_1 = require('./Contract.js');
const util_js_2 = require('./util.js');
class BlueprintSubmittableResult extends api_1.SubmittableResult {
  contract;
  constructor(result, contract) {
    super(result);
    this.contract = contract;
  }
}
exports.BlueprintSubmittableResult = BlueprintSubmittableResult;
class Blueprint extends Base_js_1.Base {
  /**
   * @description The on-chain code hash for this blueprint
   */
  codeHash;
  __internal__tx = {};
  constructor(api, abi, codeHash, decorateMethod) {
    super(api, abi, decorateMethod);
    this.codeHash = this.registry.createType('Hash', codeHash);
    this.abi.constructors.forEach(c => {
      if ((0, util_1.isUndefined)(this.__internal__tx[c.method])) {
        this.__internal__tx[c.method] = (0, util_js_2.createBluePrintTx)(c, (o, p) =>
          this.__internal__deploy(c, o, p),
        );
      }
    });
  }
  get tx() {
    return this.__internal__tx;
  }
  __internal__deploy = (
    constructorOrId,
    { gasLimit = util_1.BN_ZERO, salt, storageDepositLimit = null, value = util_1.BN_ZERO },
    params,
  ) => {
    return this.api.tx.contracts
      .instantiate(
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1
          ? (0, util_js_2.convertWeight)(gasLimit).v1Weight
          : (0, util_js_2.convertWeight)(gasLimit).v2Weight,
        storageDepositLimit,
        this.codeHash,
        this.abi.findConstructor(constructorOrId).toU8a(params),
        (0, util_js_2.encodeSalt)(salt),
      )
      .withResultTransform(
        result =>
          new BlueprintSubmittableResult(
            result,
            (0, util_js_1.applyOnEvent)(
              result,
              ['Instantiated'],
              ([record]) =>
                new Contract_js_1.Contract(
                  this.api,
                  this.abi,
                  record.event.data[1],
                  this._decorateMethod,
                ),
            ),
          ),
      );
  };
}
exports.Blueprint = Blueprint;
function extendBlueprint(type, decorateMethod) {
  return class extends Blueprint {
    static __BlueprintType = type;
    constructor(api, abi, codeHash) {
      super(api, abi, codeHash, decorateMethod);
    }
  };
}

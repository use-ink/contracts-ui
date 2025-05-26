'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.BlueprintRevive = void 0;
exports.extendBlueprint = extendBlueprint;
const util_1 = require('@polkadot/util');
const BaseRevive_js_1 = require('./BaseRevive.js');
const Blueprint_js_1 = require('./Blueprint.js');
const Contract_js_1 = require('./Contract.js');
const util_js_1 = require('./util.js');
class BlueprintRevive extends BaseRevive_js_1.BaseRevive {
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
        this.__internal__tx[c.method] = (0, util_js_1.createBluePrintTx)(c, (o, p) =>
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
    return this.api.tx.revive
      .instantiate(
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1
          ? (0, util_js_1.convertWeight)(gasLimit).v1Weight
          : (0, util_js_1.convertWeight)(gasLimit).v2Weight,
        storageDepositLimit,
        this.codeHash,
        this.abi.findConstructor(constructorOrId).toU8a(params),
        (0, util_js_1.encodeSalt)(salt),
      )
      .withResultTransform(
        result =>
          new Blueprint_js_1.BlueprintSubmittableResult(
            result,
            (() => {
              if (result.status.isInBlock || result.status.isFinalized) {
                return new Contract_js_1.Contract(
                  this.api,
                  this.abi,
                  '0x075e2a9cfb213a68dfa1f5cf6bf6d515ae212cf8',
                  this._decorateMethod,
                );
              }
              return undefined;
            })(),
          ),
      );
  };
}
exports.BlueprintRevive = BlueprintRevive;
function extendBlueprint(type, decorateMethod) {
  return class extends BlueprintRevive {
    static __BlueprintType = type;
    constructor(api, abi, codeHash) {
      super(api, abi, codeHash, decorateMethod);
    }
  };
}

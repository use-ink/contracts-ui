import { SubmittableResult } from '@polkadot/api';
import { BN_ZERO, isUndefined } from '@polkadot/util';
import { applyOnEvent } from '../util.js';
import { Base } from './Base.js';
import { Contract } from './Contract.js';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.js';
export class BlueprintSubmittableResult extends SubmittableResult {
  contract;
  constructor(result, contract) {
    super(result);
    this.contract = contract;
  }
}
export class Blueprint extends Base {
  /**
   * @description The on-chain code hash for this blueprint
   */
  codeHash;
  __internal__tx = {};
  constructor(api, abi, codeHash, decorateMethod) {
    super(api, abi, decorateMethod);
    this.codeHash = this.registry.createType('Hash', codeHash);
    this.abi.constructors.forEach(c => {
      if (isUndefined(this.__internal__tx[c.method])) {
        this.__internal__tx[c.method] = createBluePrintTx(c, (o, p) =>
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
    { gasLimit = BN_ZERO, salt, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    return this.api.tx.contracts
      .instantiate(
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
        storageDepositLimit,
        this.codeHash,
        this.abi.findConstructor(constructorOrId).toU8a(params),
        encodeSalt(salt),
      )
      .withResultTransform(
        result =>
          new BlueprintSubmittableResult(
            result,
            applyOnEvent(
              result,
              ['Instantiated'],
              ([record]) =>
                new Contract(this.api, this.abi, record.event.data[1], this._decorateMethod),
            ),
          ),
      );
  };
}
export function extendBlueprint(type, decorateMethod) {
  return class extends Blueprint {
    static __BlueprintType = type;
    constructor(api, abi, codeHash) {
      super(api, abi, codeHash, decorateMethod);
    }
  };
}

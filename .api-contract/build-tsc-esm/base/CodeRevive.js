import { SubmittableResult } from '@polkadot/api';
import { BN_ZERO, compactAddLength, isRiscV, isUndefined, u8aToU8a } from '@polkadot/util';
import { BaseRevive } from './BaseRevive.js';
import { BlueprintRevive } from './BlueprintRevive.js';
import { Contract } from './Contract.js';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.js';
export class CodeReviveSubmittableResult extends SubmittableResult {
  blueprint;
  contract;
  constructor(result, blueprint, contract) {
    super(result);
    this.blueprint = blueprint;
    this.contract = contract;
  }
}
function isValidCode(code) {
  return isRiscV(code);
}
export class CodeRevive extends BaseRevive {
  code;
  __internal__tx = {};
  constructor(api, abi, wasm, decorateMethod) {
    super(api, abi, decorateMethod);
    this.code = isValidCode(this.abi.info.source.wasm) ? this.abi.info.source.wasm : u8aToU8a(wasm);
    if (!isValidCode(this.code)) {
      throw new Error('Invalid code provided');
    }
    this.abi.constructors.forEach(c => {
      if (isUndefined(this.__internal__tx[c.method])) {
        this.__internal__tx[c.method] = createBluePrintTx(c, (o, p) =>
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
    { gasLimit = BN_ZERO, salt, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    return this.api.tx.revive
      .instantiateWithCode(
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
        storageDepositLimit,
        compactAddLength(this.code),
        this.abi.findConstructor(constructorOrId).toU8a(params),
        encodeSalt(salt),
      )
      .withResultTransform(
        result =>
          new CodeReviveSubmittableResult(
            result,
            new BlueprintRevive(
              this.api,
              this.abi,
              this.abi.info.source.wasmHash,
              this._decorateMethod,
            ),
            new Contract(
              this.api,
              this.abi,
              '0x075e2a9cfb213a68dfa1f5cf6bf6d515ae212cf8',
              this._decorateMethod,
            ),
          ),
      );
  };
}
export function extendCode(type, decorateMethod) {
  return class extends CodeRevive {
    static __CodeType = type;
    constructor(api, abi, wasm) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}

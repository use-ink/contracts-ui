// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { SubmittableResult } from '@polkadot/api';
import { BN_ZERO, compactAddLength, isRiscV, isUndefined, isWasm, u8aToU8a } from '@polkadot/util';
import { applyOnEvent } from '../util.js';
import { Base } from './Base.js';
import { Blueprint } from './Blueprint.js';
import { Contract } from './Contract.js';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.js';
export class CodeSubmittableResult extends SubmittableResult {
  blueprint;
  contract;
  constructor(result, blueprint, contract) {
    super(result);
    this.blueprint = blueprint;
    this.contract = contract;
  }
}
// checks to see if the code (or at least the header)
// is a valid/supported format
function isValidCode(code) {
  return isWasm(code) || isRiscV(code);
}
export class Code extends Base {
  code;
  #tx = {};
  constructor(api, abi, wasm, decorateMethod) {
    super(api, abi, decorateMethod);
    this.code = isValidCode(this.abi.info.source.wasm) ? this.abi.info.source.wasm : u8aToU8a(wasm);
    if (!isValidCode(this.code)) {
      throw new Error('Invalid code provided');
    }
    this.abi.constructors.forEach(c => {
      if (isUndefined(this.#tx[c.method])) {
        this.#tx[c.method] = createBluePrintTx(c, (o, p) => this.#instantiate(c, o, p));
      }
    });
  }
  get tx() {
    return this.#tx;
  }
  #instantiate = (
    constructorOrId,
    { gasLimit = BN_ZERO, salt, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    return this.api.tx.contracts
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
          new CodeSubmittableResult(
            result,
            ...(applyOnEvent(result, ['CodeStored', 'Instantiated'], records =>
              records.reduce(
                ([blueprint, contract], { event }) =>
                  this.api.events.contracts.Instantiated.is(event)
                    ? [
                        blueprint,
                        new Contract(this.api, this.abi, event.data[1], this._decorateMethod),
                      ]
                    : this.api.events.contracts.CodeStored.is(event)
                      ? [
                          new Blueprint(this.api, this.abi, event.data[0], this._decorateMethod),
                          contract,
                        ]
                      : [blueprint, contract],
                [undefined, undefined],
              ),
            ) || [undefined, undefined]),
          ),
      );
  };
}
export function extendCode(type, decorateMethod) {
  return class extends Code {
    static __CodeType = type;
    constructor(api, abi, wasm) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0VBQW9FO0FBQ3BFLHNDQUFzQztBQVl0QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFJekUsTUFBTSxPQUFPLHFCQUFnRCxTQUFRLGlCQUFpQjtJQUMzRSxTQUFTLENBQWtDO0lBQzNDLFFBQVEsQ0FBaUM7SUFFbEQsWUFBYSxNQUEwQixFQUFFLFNBQTBDLEVBQUUsUUFBd0M7UUFDM0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBRUQscURBQXFEO0FBQ3JELDhCQUE4QjtBQUM5QixTQUFTLFdBQVcsQ0FBRSxJQUFnQjtJQUNwQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELE1BQU0sT0FBTyxJQUErQixTQUFRLElBQWE7SUFDdEQsSUFBSSxDQUFhO0lBRWpCLEdBQUcsR0FBZ0MsRUFB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
//# sourceHash=cc94d1b7f0f20c5baf3f2936d3bfe76e2c8114d5240941cb42032fcd39578155

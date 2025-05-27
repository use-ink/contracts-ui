// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { map } from 'rxjs';
import { SubmittableResult } from '@polkadot/api';
import { BN, BN_HUNDRED, BN_ONE, BN_ZERO, isUndefined, logger } from '@polkadot/util';
import { applyOnEvent } from '../util.js';
import { Base } from './Base.js';
import { convertWeight, withMeta } from './util.js';
// As per Rust, 5 * GAS_PER_SEC
const MAX_CALL_GAS = new BN(5_000_000_000_000).isub(BN_ONE);
const l = logger('Contract');
function createQuery(meta, fn) {
  return withMeta(meta, (origin, options, ...params) => fn(origin, options, params));
}
function createTx(meta, fn) {
  return withMeta(meta, (options, ...params) => fn(options, params));
}
export class ContractSubmittableResult extends SubmittableResult {
  contractEvents;
  constructor(result, contractEvents) {
    super(result);
    this.contractEvents = contractEvents;
  }
}
export class Contract extends Base {
  /**
   * @description The on-chain address for this contract
   */
  address;
  #query = {};
  #tx = {};
  constructor(api, abi, address, decorateMethod) {
    super(api, abi, decorateMethod);
    this.address = this.registry.createType('AccountId', address);
    this.abi.messages.forEach(m => {
      if (isUndefined(this.#tx[m.method])) {
        this.#tx[m.method] = createTx(m, (o, p) => this.#exec(m, o, p));
      }
      if (isUndefined(this.#query[m.method])) {
        this.#query[m.method] = createQuery(m, (f, o, p) => this.#read(m, o, p).send(f));
      }
    });
  }
  get query() {
    return this.#query;
  }
  get tx() {
    return this.#tx;
  }
  #getGas = (_gasLimit, isCall = false) => {
    const weight = convertWeight(_gasLimit);
    if (weight.v1Weight.gt(BN_ZERO)) {
      return weight;
    }
    return convertWeight(
      isCall
        ? MAX_CALL_GAS
        : convertWeight(
            this.api.consts.system.blockWeights
              ? this.api.consts.system.blockWeights.maxBlock
              : this.api.consts.system['maximumBlockWeight'],
          )
            .v1Weight.muln(64)
            .div(BN_HUNDRED),
    );
  };
  #exec = (
    messageOrId,
    { gasLimit = BN_ZERO, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    return this.api.tx.contracts
      .call(
        this.address,
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
        storageDepositLimit,
        this.abi.findMessage(messageOrId).toU8a(params),
      )
      .withResultTransform(
        result =>
          // ContractEmitted is the current generation, ContractExecution is the previous generation
          new ContractSubmittableResult(
            result,
            applyOnEvent(result, ['ContractEmitted', 'ContractExecution'], records =>
              records
                .map(record => {
                  try {
                    return this.abi.decodeEvent(record);
                  } catch (error) {
                    l.error(`Unable to decode contract event: ${error.message}`);
                    return null;
                  }
                })
                .filter(decoded => !!decoded),
            ),
          ),
      );
  };
  #read = (
    messageOrId,
    { gasLimit = BN_ZERO, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    const message = this.abi.findMessage(messageOrId);
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      send: this._decorateMethod(origin =>
        this.api.rx.call.contractsApi
          .call(
            origin,
            this.address,
            value,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore jiggle v1 weights, metadata points to latest
            this._isWeightV1
              ? this.#getGas(gasLimit, true).v1Weight
              : this.#getGas(gasLimit, true).v2Weight,
            storageDepositLimit,
            message.toU8a(params),
          )
          .pipe(
            map(({ debugMessage, gasConsumed, gasRequired, result, storageDeposit }) => ({
              debugMessage,
              gasConsumed,
              gasRequired:
                gasRequired && !convertWeight(gasRequired).v1Weight.isZero()
                  ? gasRequired
                  : gasConsumed,
              output:
                result.isOk && message.returnType
                  ? this.abi.registry.createTypeUnsafe(
                      message.returnType.lookupName || message.returnType.type,
                      [result.asOk.data.toU8a(true)],
                      { isPedantic: true },
                    )
                  : null,
              result,
              storageDeposit,
            })),
          ),
      ),
    };
  };
}
export function extendContract(type, decorateMethod) {
  return class extends Contract {
    static __ContractType = type;
    constructor(api, abi, address) {
      super(api, abi, address, decorateMethod);
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb250cmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvRUFBb0U7QUFDcEUsc0NBQXNDO0FBV3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0IsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDMUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUlwRCwrQkFBK0I7QUFDL0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTdCLFNBQVMsV0FBVyxDQUE2QixJQUFnQixFQUFFLEVBQThJO0lBQy9NLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQXVDLEVBQUUsT0FBd0IsRUFBRSxHQUFHLE1BQWlCLEVBQW9ELEVBQUUsQ0FDbEssRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQzVCLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQTZCLElBQWdCLEVBQUUsRUFBa0Y7SUFDaEosT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBd0IsRUFBRSxHQUFHLE1BQWlCLEVBQWlDLEVBQUUsQ0FDdEcsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMs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
//# sourceHash=9294d9c9eb2ea879e15dc3dba1efa731c4b0f0f7889190e1bb0bd64425ea6132

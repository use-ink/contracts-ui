import { map } from 'rxjs';
import { SubmittableResult } from '@polkadot/api';
import { BN, BN_HUNDRED, BN_ONE, BN_ZERO, isUndefined, logger } from '@polkadot/util';
import { applyOnEvent } from '../util.js';
import { BaseRevive } from './BaseRevive.js';
import { convertWeight, withMeta } from './util.js';
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
export class ContractRevive extends BaseRevive {
  /**
   * @description The on-chain address for this contract
   */
  address;
  __internal__query = {};
  __internal__tx = {};
  constructor(api, abi, address, decorateMethod) {
    super(api, abi, decorateMethod);
    this.address = this.registry.createType('AccountId20', address);
    this.abi.messages.forEach(m => {
      if (isUndefined(this.__internal__tx[m.method])) {
        this.__internal__tx[m.method] = createTx(m, (o, p) => this.__internal__exec(m, o, p));
      }
      if (isUndefined(this.__internal__query[m.method])) {
        this.__internal__query[m.method] = createQuery(m, (f, o, p) =>
          this.__internal__read(m, o, p).send(f),
        );
      }
    });
  }
  get query() {
    return this.__internal__query;
  }
  get tx() {
    return this.__internal__tx;
  }
  __internal__getGas = (_gasLimit, isCall = false) => {
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
  __internal__exec = (
    messageOrId,
    { gasLimit = BN_ZERO, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    return this.api.tx.revive
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
  __internal__read = (
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
              ? this.__internal__getGas(gasLimit, true).v1Weight
              : this.__internal__getGas(gasLimit, true).v2Weight,
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
  return class extends ContractRevive {
    static __ContractType = type;
    constructor(api, abi, address) {
      super(api, abi, address, decorateMethod);
    }
  };
}

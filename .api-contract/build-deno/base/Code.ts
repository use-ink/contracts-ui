import { Buffer } from 'node:buffer';

import type { ApiBase } from 'https://deno.land/x/polkadot/api/base/index.ts';
import type { SubmittableExtrinsic } from 'https://deno.land/x/polkadot/api/submittable/types.ts';
import type { ApiTypes, DecorateMethod } from 'https://deno.land/x/polkadot/api/types/index.ts';
import type {
  AccountId,
  EventRecord,
} from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { ISubmittableResult } from 'https://deno.land/x/polkadot/types/types/index.ts';
import type { Codec } from 'https://deno.land/x/polkadot/types-codec/types/index.ts';
import type { Abi } from '../Abi/index.ts';
import type { AbiConstructor, BlueprintOptions } from '../types.ts';
import type { MapConstructorExec } from './types.ts';

import { SubmittableResult } from 'https://deno.land/x/polkadot/api/mod.ts';
import {
  BN_ZERO,
  compactAddLength,
  isRiscV,
  isUndefined,
  isWasm,
  u8aToU8a,
} from 'https://deno.land/x/polkadot/util/mod.ts';

import { applyOnEvent } from '../util.ts';
import { Base } from './Base.ts';
import { Blueprint } from './Blueprint.ts';
import { Contract } from './Contract.ts';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.ts';

export type CodeConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  wasm: Uint8Array | string | Buffer | null | undefined,
) => Code<ApiType>;

export class CodeSubmittableResult<ApiType extends ApiTypes> extends SubmittableResult {
  readonly blueprint?: Blueprint<ApiType> | undefined;
  readonly contract?: Contract<ApiType> | undefined;

  constructor(
    result: ISubmittableResult,
    blueprint?: Blueprint<ApiType> | undefined,
    contract?: Contract<ApiType> | undefined,
  ) {
    super(result);

    this.blueprint = blueprint;
    this.contract = contract;
  }
}

function isValidCode(code: Uint8Array): boolean {
  return isWasm(code) || isRiscV(code);
}

export class Code<ApiType extends ApiTypes> extends Base<ApiType> {
  readonly code: Uint8Array;

  readonly #tx: MapConstructorExec<ApiType> = {};

  constructor(
    api: ApiBase<ApiType>,
    abi: string | Record<string, unknown> | Abi,
    wasm: Uint8Array | string | Buffer | null | undefined,
    decorateMethod: DecorateMethod<ApiType>,
  ) {
    super(api, abi, decorateMethod);

    this.code = isValidCode(this.abi.info.source.wasm) ? this.abi.info.source.wasm : u8aToU8a(wasm);

    if (!isValidCode(this.code)) {
      throw new Error('Invalid code provided');
    }

    this.abi.constructors.forEach((c): void => {
      if (isUndefined(this.#tx[c.method])) {
        this.#tx[c.method] = createBluePrintTx(c, (o, p) => this.#instantiate(c, o, p));
      }
    });
  }

  public get tx(): MapConstructorExec<ApiType> {
    return this.#tx;
  }

  #instantiate = (
    constructorOrId: AbiConstructor | string | number,
    { gasLimit = BN_ZERO, salt, storageDepositLimit = null, value = BN_ZERO }: BlueprintOptions,
    params: unknown[],
  ): SubmittableExtrinsic<ApiType, CodeSubmittableResult<ApiType>> => {
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
        (result: ISubmittableResult) =>
          new CodeSubmittableResult(
            result,
            ...(applyOnEvent(result, ['CodeStored', 'Instantiated'], (records: EventRecord[]) =>
              records.reduce<[Blueprint<ApiType> | undefined, Contract<ApiType> | undefined]>(
                ([blueprint, contract], { event }) =>
                  this.api.events.contracts.Instantiated.is(event)
                    ? [
                        blueprint,
                        new Contract<ApiType>(
                          this.api,
                          this.abi,
                          (event as unknown as { data: [Codec, AccountId] }).data[1],
                          this._decorateMethod,
                        ),
                      ]
                    : this.api.events.contracts.CodeStored.is(event)
                      ? [
                          new Blueprint<ApiType>(
                            this.api,
                            this.abi,
                            (event as unknown as { data: [AccountId] }).data[0],
                            this._decorateMethod,
                          ),
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

export function extendCode<ApiType extends ApiTypes>(
  type: ApiType,
  decorateMethod: DecorateMethod<ApiType>,
): CodeConstructor<ApiType> {
  return class extends Code<ApiType> {
    static __CodeType = type;

    constructor(
      api: ApiBase<ApiType>,
      abi: string | Record<string, unknown> | Abi,
      wasm: Uint8Array | string | Buffer | null | undefined,
    ) {
      super(api, abi, wasm, decorateMethod);
    }
  };
}

import { Buffer } from 'node:buffer';

import type { ApiBase } from 'https://deno.land/x/polkadot/api/base/index.ts';
import type { SubmittableExtrinsic } from 'https://deno.land/x/polkadot/api/submittable/types.ts';
import type { ApiTypes, DecorateMethod } from 'https://deno.land/x/polkadot/api/types/index.ts';
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
  u8aToU8a,
} from 'https://deno.land/x/polkadot/util/mod.ts';

import { BaseRevive } from './BaseRevive.ts';
import { BlueprintRevive } from './BlueprintRevive.ts';
import { Contract } from './Contract.ts';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.ts';

export type CodeReviveConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  wasm: Uint8Array | string | Buffer | null | undefined,
) => CodeRevive<ApiType>;

export class CodeReviveSubmittableResult<ApiType extends ApiTypes> extends SubmittableResult {
  readonly blueprint?: BlueprintRevive<ApiType> | undefined;
  readonly contract?: Contract<ApiType> | undefined;

  constructor(
    result: ISubmittableResult,
    blueprint?: BlueprintRevive<ApiType> | undefined,
    contract?: Contract<ApiType> | undefined,
  ) {
    super(result);

    this.blueprint = blueprint;
    this.contract = contract;
  }
}

function isValidCode(code: Uint8Array): boolean {
  return isRiscV(code);
}

export class CodeRevive<ApiType extends ApiTypes> extends BaseRevive<ApiType> {
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
  ): SubmittableExtrinsic<ApiType, CodeReviveSubmittableResult<ApiType>> => {
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
        (result: ISubmittableResult) =>
          new CodeReviveSubmittableResult(
            result,
            new BlueprintRevive<ApiType>(
              this.api,
              this.abi,
              this.abi.info.source.wasmHash,
              this._decorateMethod,
            ),
            new Contract<ApiType>(
              this.api,
              this.abi,
              '0x075e2a9cfb213a68dfa1f5cf6bf6d515ae212cf8',
              this._decorateMethod,
            ),
          ),
      );
  };
}

export function extendCode<ApiType extends ApiTypes>(
  type: ApiType,
  decorateMethod: DecorateMethod<ApiType>,
): CodeReviveConstructor<ApiType> {
  return class extends CodeRevive<ApiType> {
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

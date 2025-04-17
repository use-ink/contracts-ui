import type { ApiBase } from 'https://deno.land/x/polkadot/api/base/index.ts';
import type { SubmittableExtrinsic } from 'https://deno.land/x/polkadot/api/submittable/types.ts';
import type { ApiTypes, DecorateMethod } from 'https://deno.land/x/polkadot/api/types/index.ts';
import type { Hash } from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { ISubmittableResult } from 'https://deno.land/x/polkadot/types/types/index.ts';
import type { Abi } from '../Abi/index.ts';
import type { AbiConstructor, BlueprintOptions } from '../types.ts';
import type { MapConstructorExec } from './types.ts';

import { SubmittableResult } from 'https://deno.land/x/polkadot/api/mod.ts';
import { BN_ZERO, isUndefined } from 'https://deno.land/x/polkadot/util/mod.ts';

import { Base } from './Base.ts';
import { Contract } from './Contract.ts';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.ts';

export type BlueprintConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  codeHash: string | Hash | Uint8Array,
) => Blueprint<ApiType>;

export class BlueprintSubmittableResult<ApiType extends ApiTypes> extends SubmittableResult {
  readonly contract?: Contract<ApiType> | undefined;

  constructor(result: ISubmittableResult, contract?: Contract<ApiType>) {
    super(result);

    this.contract = contract;
  }
}

export class Blueprint<ApiType extends ApiTypes> extends Base<ApiType> {
  /**
   * @description The on-chain code hash for this blueprint
   */
  readonly codeHash: Hash;

  readonly #tx: MapConstructorExec<ApiType> = {};

  constructor(
    api: ApiBase<ApiType>,
    abi: string | Record<string, unknown> | Abi,
    codeHash: string | Hash | Uint8Array,
    decorateMethod: DecorateMethod<ApiType>,
  ) {
    super(api, abi, decorateMethod);

    this.codeHash = this.registry.createType('Hash', codeHash);

    this.abi.constructors.forEach((c): void => {
      if (isUndefined(this.#tx[c.method])) {
        this.#tx[c.method] = createBluePrintTx(c, (o, p) => this.#deploy(c, o, p));
      }
    });
  }

  public get tx(): MapConstructorExec<ApiType> {
    return this.#tx;
  }

  #deploy = (
    constructorOrId: AbiConstructor | string | number,
    { gasLimit = BN_ZERO, salt, storageDepositLimit = null, value = BN_ZERO }: BlueprintOptions,
    params: unknown[],
  ): SubmittableExtrinsic<ApiType, BlueprintSubmittableResult<ApiType>> => {
    return this.api.tx.revive
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
        (result: ISubmittableResult) =>
          new BlueprintSubmittableResult(
            result,
            (() => {
              if (result.status.isInBlock || result.status.isFinalized) {
                return new Contract<ApiType>(
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

export function extendBlueprint<ApiType extends ApiTypes>(
  type: ApiType,
  decorateMethod: DecorateMethod<ApiType>,
): BlueprintConstructor<ApiType> {
  return class extends Blueprint<ApiType> {
    static __BlueprintType = type;

    constructor(
      api: ApiBase<ApiType>,
      abi: string | Record<string, unknown> | Abi,
      codeHash: string | Hash | Uint8Array,
    ) {
      super(api, abi, codeHash, decorateMethod);
    }
  };
}

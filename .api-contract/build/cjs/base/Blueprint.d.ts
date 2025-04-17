import type { ApiBase } from '@polkadot/api/base';
import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { Abi } from '../Abi/index.js';
import type { MapConstructorExec } from './types.js';
import { SubmittableResult } from '@polkadot/api';
import { Base } from './Base.js';
import { Contract } from './Contract.js';
export type BlueprintConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  codeHash: string | Hash | Uint8Array,
) => Blueprint<ApiType>;
export declare class BlueprintSubmittableResult<
  ApiType extends ApiTypes,
> extends SubmittableResult {
  readonly contract?: Contract<ApiType> | undefined;
  constructor(result: ISubmittableResult, contract?: Contract<ApiType>);
}
export declare class Blueprint<ApiType extends ApiTypes> extends Base<ApiType> {
  #private;
  /**
   * @description The on-chain code hash for this blueprint
   */
  readonly codeHash: Hash;
  constructor(
    api: ApiBase<ApiType>,
    abi: string | Record<string, unknown> | Abi,
    codeHash: string | Hash | Uint8Array,
    decorateMethod: DecorateMethod<ApiType>,
  );
  get tx(): MapConstructorExec<ApiType>;
}
export declare function extendBlueprint<ApiType extends ApiTypes>(
  type: ApiType,
  decorateMethod: DecorateMethod<ApiType>,
): BlueprintConstructor<ApiType>;

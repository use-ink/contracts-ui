import type { ApiBase } from '@polkadot/api/base';
import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { Abi } from '../Abi/index.js';
import type { MapConstructorExec } from './types.js';
import { BaseRevive } from './BaseRevive.js';
export type BlueprintReviveConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  codeHash: string | Hash | Uint8Array,
) => BlueprintRevive<ApiType>;
export declare class BlueprintRevive<ApiType extends ApiTypes> extends BaseRevive<ApiType> {
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
): BlueprintReviveConstructor<ApiType>;

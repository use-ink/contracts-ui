import type { ApiBase } from '@polkadot/api/base';
import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { Abi } from '../Abi/index.js';
import type { MapConstructorExec } from './types.js';
import { SubmittableResult } from '@polkadot/api';
import { BaseRevive } from './BaseRevive.js';
import { BlueprintRevive } from './BlueprintRevive.js';
import { Contract } from './Contract.js';
export type CodeReviveConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  wasm: Uint8Array | string | Buffer | null | undefined,
) => CodeRevive<ApiType>;
export declare class CodeReviveSubmittableResult<
  ApiType extends ApiTypes,
> extends SubmittableResult {
  readonly blueprint?: BlueprintRevive<ApiType> | undefined;
  readonly contract?: Contract<ApiType> | undefined;
  constructor(
    result: ISubmittableResult,
    blueprint?: BlueprintRevive<ApiType> | undefined,
    contract?: Contract<ApiType> | undefined,
  );
}
export declare class CodeRevive<ApiType extends ApiTypes> extends BaseRevive<ApiType> {
  #private;
  readonly code: Uint8Array;
  constructor(
    api: ApiBase<ApiType>,
    abi: string | Record<string, unknown> | Abi,
    wasm: Uint8Array | string | Buffer | null | undefined,
    decorateMethod: DecorateMethod<ApiType>,
  );
  get tx(): MapConstructorExec<ApiType>;
}
export declare function extendCode<ApiType extends ApiTypes>(
  type: ApiType,
  decorateMethod: DecorateMethod<ApiType>,
): CodeReviveConstructor<ApiType>;

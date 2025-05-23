import type { ApiBase } from '@polkadot/api/base';
import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { Abi } from '../Abi/index.js';
import type { MapConstructorExec } from './types.js';
import { SubmittableResult } from '@polkadot/api';
import { Base } from './Base.js';
import { Blueprint } from './Blueprint.js';
import { Contract } from './Contract.js';
export type CodeConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  wasm: Uint8Array | string | Buffer | null | undefined,
) => Code<ApiType>;
export declare class CodeSubmittableResult<ApiType extends ApiTypes> extends SubmittableResult {
  readonly blueprint?: Blueprint<ApiType> | undefined;
  readonly contract?: Contract<ApiType> | undefined;
  constructor(
    result: ISubmittableResult,
    blueprint?: Blueprint<ApiType> | undefined,
    contract?: Contract<ApiType> | undefined,
  );
}
export declare class Code<ApiType extends ApiTypes> extends Base<ApiType> {
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
): CodeConstructor<ApiType>;

import type { ApiBase } from '@polkadot/api/base';
import type { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import type { AccountId, AccountId20 } from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';
import type { Abi } from '../Abi/index.js';
import type { DecodedEvent } from '../types.js';
import type { MapMessageQuery, MapMessageTx } from './types.js';
import { SubmittableResult } from '@polkadot/api';
import { Base } from './Base.js';
export type ContractConstructor<ApiType extends ApiTypes> = new (
  api: ApiBase<ApiType>,
  abi: string | Record<string, unknown> | Abi,
  address: string | AccountId,
) => Contract<ApiType>;
export declare class ContractSubmittableResult extends SubmittableResult {
  readonly contractEvents?: DecodedEvent[] | undefined;
  constructor(result: ISubmittableResult, contractEvents?: DecodedEvent[]);
}
export declare class Contract<ApiType extends ApiTypes> extends Base<ApiType> {
  #private;
  /**
   * @description The on-chain address for this contract
   */
  readonly address: AccountId20;
  constructor(
    api: ApiBase<ApiType>,
    abi: string | Record<string, unknown> | Abi,
    address: string | AccountId20,
    decorateMethod: DecorateMethod<ApiType>,
  );
  get query(): MapMessageQuery<ApiType>;
  get tx(): MapMessageTx<ApiType>;
}
export declare function extendContract<ApiType extends ApiTypes>(
  type: ApiType,
  decorateMethod: DecorateMethod<ApiType>,
): ContractConstructor<ApiType>;

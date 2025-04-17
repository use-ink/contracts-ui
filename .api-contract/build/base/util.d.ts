import type { SubmittableResult } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ApiTypes } from '@polkadot/api/types';
import type { WeightV1, WeightV2 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { AbiConstructor, AbiMessage, BlueprintOptions, WeightAll } from '../types.js';
import type { BlueprintDeploy, ContractGeneric } from './types.js';
export declare const EMPTY_SALT: Uint8Array;
export declare function withMeta<
  T extends {
    meta: AbiMessage;
  },
>(meta: AbiMessage, creator: Omit<T, 'meta'>): T;
export declare function createBluePrintTx<ApiType extends ApiTypes, R extends SubmittableResult>(
  meta: AbiMessage,
  fn: (options: BlueprintOptions, params: unknown[]) => SubmittableExtrinsic<ApiType, R>,
): BlueprintDeploy<ApiType>;
export declare function createBluePrintWithId<T>(
  fn: (
    constructorOrId: AbiConstructor | string | number,
    options: BlueprintOptions,
    params: unknown[],
  ) => T,
): ContractGeneric<BlueprintOptions, T>;
export declare function encodeSalt(salt?: Uint8Array | string | null): Uint8Array;
export declare function convertWeight(
  weight: WeightV1 | WeightV2 | bigint | string | number | BN,
): WeightAll;
export declare function isWeightV2(
  weight: WeightV1 | WeightV2 | bigint | string | number | BN,
): weight is WeightV2;

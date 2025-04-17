import type { SubmittableResult } from 'https://deno.land/x/polkadot/api/mod.ts';
import type { SubmittableExtrinsic } from 'https://deno.land/x/polkadot/api/submittable/types.ts';
import type { ApiTypes } from 'https://deno.land/x/polkadot/api/types/index.ts';
import type { WeightV1, WeightV2 } from 'https://deno.land/x/polkadot/types/interfaces/index.ts';
import type { BN } from 'https://deno.land/x/polkadot/util/mod.ts';
import type { AbiConstructor, AbiMessage, BlueprintOptions, WeightAll } from '../types.ts';
import type { BlueprintDeploy, ContractGeneric } from './types.ts';

import { Bytes } from 'https://deno.land/x/polkadot/types/mod.ts';
import { bnToBn, compactAddLength, u8aToU8a } from 'https://deno.land/x/polkadot/util/mod.ts';
import { randomAsU8a } from 'https://deno.land/x/polkadot/util-crypto/mod.ts';

export const EMPTY_SALT = new Uint8Array();

export function withMeta<T extends { meta: AbiMessage }>(
  meta: AbiMessage,
  creator: Omit<T, 'meta'>,
): T {
  (creator as T).meta = meta;

  return creator as T;
}

export function createBluePrintTx<ApiType extends ApiTypes, R extends SubmittableResult>(
  meta: AbiMessage,
  fn: (options: BlueprintOptions, params: unknown[]) => SubmittableExtrinsic<ApiType, R>,
): BlueprintDeploy<ApiType> {
  return withMeta(
    meta,
    (options: BlueprintOptions, ...params: unknown[]): SubmittableExtrinsic<ApiType, R> =>
      fn(options, params),
  );
}

export function createBluePrintWithId<T>(
  fn: (
    constructorOrId: AbiConstructor | string | number,
    options: BlueprintOptions,
    params: unknown[],
  ) => T,
): ContractGeneric<BlueprintOptions, T> {
  return (
    constructorOrId: AbiConstructor | string | number,
    options: BlueprintOptions,
    ...params: unknown[]
  ): T => fn(constructorOrId, options, params);
}

export function encodeSalt(salt: Uint8Array | string | null = randomAsU8a()): Uint8Array {
  return salt instanceof Bytes
    ? salt
    : salt?.length
      ? compactAddLength(u8aToU8a(salt))
      : EMPTY_SALT;
}

export function convertWeight(
  weight: WeightV1 | WeightV2 | bigint | string | number | BN,
): WeightAll {
  const [refTime, proofSize] = isWeightV2(weight)
    ? [weight.refTime.toBn(), weight.proofSize.toBn()]
    : [bnToBn(weight), undefined];

  return {
    v1Weight: refTime,
    v2Weight: { proofSize, refTime },
  };
}

export function isWeightV2(
  weight: WeightV1 | WeightV2 | bigint | string | number | BN,
): weight is WeightV2 {
  return !!(weight as WeightV2).proofSize;
}

// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BlueprintPromise, CodePromise } from '@polkadot/api-contract';
import { isNumber } from '@polkadot/util';
import { encodeSalt, transformUserInput } from '../util';
import type { ApiPromise, InstantiateState, SubmittableExtrinsic } from 'types';

export function createInstantiateTx(
  api: ApiPromise,
  {
    argValues: [argValues],
    codeHash,
    constructorIndex: { value: constructorIndex },
    weight: { weight: gasLimit },
    endowment,
    metadata: { value: metadata },
    isUsingSalt,
    salt,
  }: InstantiateState
): SubmittableExtrinsic<'promise'> | null {
  const isFromHash = !!codeHash;
  const saltu8a = isUsingSalt ? encodeSalt(salt.value) : undefined;

  const options = {
    gasLimit,
    salt: saltu8a,
    value: endowment.value ? api.registry.createType('Balance', endowment.value) : undefined,
  };

  const wasm = metadata?.info.source.wasm;
  const isValid = isFromHash || !!wasm;

  if (isValid && metadata && isNumber(constructorIndex) && metadata && argValues) {
    const codeOrBlueprint = isFromHash
      ? new BlueprintPromise(api, metadata, codeHash)
      : new CodePromise(api, metadata, wasm && wasm.toU8a());

    const constructor = metadata.findConstructor(constructorIndex);

    const transformed = transformUserInput(api, constructor.args, argValues);

    return constructor.args.length > 0
      ? codeOrBlueprint.tx[constructor.method](options, ...transformed)
      : codeOrBlueprint.tx[constructor.method](options);
  } else {
    throw new Error('Unknown error');
  }
}

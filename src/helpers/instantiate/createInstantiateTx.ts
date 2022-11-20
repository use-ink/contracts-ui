// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BlueprintPromise, CodePromise } from '@polkadot/api-contract';
import { encodeSalt, transformUserInput, isNumber } from '../util';
import type { ApiPromise, InstantiateData, SubmittableExtrinsic } from 'types';

export function createInstantiateTx(
  api: ApiPromise,
  {
    argValues,
    codeHash,
    constructorIndex,
    gasLimit,
    value,
    metadata,
    salt,
    storageDepositLimit,
  }: Omit<InstantiateData, 'name'>
): SubmittableExtrinsic<'promise'> {
  const wasm = metadata?.info.source.wasm;
  const isValid = codeHash || !!wasm;

  if (isValid && metadata && isNumber(constructorIndex) && metadata && argValues) {
    const constructor = metadata.findConstructor(constructorIndex);

    const options = {
      gasLimit: api.registry.createType('WeightV2', gasLimit),
      salt: salt ? encodeSalt(salt) : null,
      storageDepositLimit: storageDepositLimit || undefined,
      value: value && constructor.isPayable ? api.registry.createType('Balance', value) : undefined,
    };

    const codeOrBlueprint = codeHash
      ? new BlueprintPromise(api, metadata, codeHash)
      : new CodePromise(api, metadata, wasm && wasm.toU8a());

    const transformed = transformUserInput(api.registry, constructor.args, argValues);

    return constructor.args.length > 0
      ? codeOrBlueprint.tx[constructor.method](options, ...transformed)
      : codeOrBlueprint.tx[constructor.method](options);
  } else {
    throw new Error('Error creating instantiate tx');
  }
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BlueprintPromise, CodePromise } from '@polkadot/api-contract';
import { isNumber } from '@polkadot/util';
import { encodeSalt, transformUserInput } from '../util';
import type { ApiPromise, InstantiateData, SubmittableExtrinsic } from 'types';

export function createInstantiateTx(
  api: ApiPromise,
  {
    argValues,
    codeHash,
    constructorIndex,
    weight: gasLimit,
    value,
    metadata,
    salt,
    storageDepositLimit,
  }: InstantiateData
): SubmittableExtrinsic<'promise'> | null {
  const wasm = metadata?.info.source.wasm;
  const isValid = codeHash || !!wasm;

  if (isValid && metadata && isNumber(constructorIndex) && metadata && argValues) {
    const constructor = metadata.findConstructor(constructorIndex);

    const options = {
      gasLimit,
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
    throw new Error('Unknown error');
  }
}

// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BlueprintPromise, CodePromise } from '@polkadot/api-contract';
import { isValidAddress, isValidCodeHash, isNumber } from 'lib/util';
import { transformUserInput } from 'lib/callOptions';
import {
  ApiPromise,
  CodeBundleDocument,
  BlueprintOptions,
  InstantiateData,
  SubmittableExtrinsic,
} from 'types';
import { InkVersion } from 'ui/contexts';
import { PalletReviveStorageContractInfo } from '@polkadot/types/lookup';

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
  }: Omit<InstantiateData, 'name'>,
): SubmittableExtrinsic<'promise'> {
  const wasm = metadata?.info.source.wasm;
  const isValid = codeHash || !!wasm;

  if (isValid && metadata && isNumber(constructorIndex) && metadata && argValues) {
    const constructor = metadata.findConstructor(constructorIndex);

    const options: BlueprintOptions = {
      gasLimit,
      salt: salt || null,
      storageDepositLimit,
      value,
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

export async function getContractInfo(api: ApiPromise, address: string, version: InkVersion) {
  if (isValidAddress(address, version)) {
    if (version === 'v6') {
      // TODO: Temporary workaround:
      // accountInfoOf is a breaking change until it’s released and included in contracts-api.
      const accountInfoOption: any = await api.query.revive.accountInfoOf(address);
      if (accountInfoOption.isNone) return null;

      const { accountType } = accountInfoOption.unwrap();
      return accountType.isContract
        ? (accountType.asContract as PalletReviveStorageContractInfo)
        : null;
    } else {
      return (await api.query.contracts.contractInfoOf(address)).unwrapOr(null);
    }
  }
}

export async function checkOnChainCode(
  api: ApiPromise,
  codeHash: string,
  version: InkVersion,
): Promise<boolean> {
  if (!isValidCodeHash(codeHash)) return false;

  if (version === 'v6') {
    return (await api.query.revive.pristineCode(codeHash)).isSome;
  } else {
    return (await api.query.contracts.pristineCode(codeHash)).isSome;
  }
}

export async function filterOnChainCode(
  api: ApiPromise,
  items: CodeBundleDocument[],
  version: InkVersion,
) {
  const codes: CodeBundleDocument[] = [];
  for (const item of items) {
    const isOnChain = await checkOnChainCode(api, item.codeHash, version);
    isOnChain && codes.push(item);
  }
  return codes;
}

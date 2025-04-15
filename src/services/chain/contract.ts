// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BlueprintPromise, CodePromise, ContractPromise } from '@polkadot/api-contract';
import { isValidAddress, isValidCodeHash, isNumber } from 'lib/util';
import { transformUserInput } from 'lib/callOptions';
import {
  ApiPromise,
  CodeBundleDocument,
  BlueprintOptions,
  InstantiateData,
  SubmittableExtrinsic,
} from 'types';
import { stringToU8a, compactAddLength, u8aToU8a } from '@polkadot/util';
import { ISubmittableResult } from '@polkadot/types/types';
import { BlueprintSubmittableResult, Contract } from '@polkadot/api-contract/base';
import { contractsAbi } from '@polkadot/types/interfaces/definitions';

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
  const wasm = u8aToU8a(metadata?.json.source.contract_binary);
  const isValid = codeHash || !!wasm;

  if (isValid && metadata && isNumber(constructorIndex) && metadata && argValues) {
    const constructor = metadata.findConstructor(constructorIndex);

    const options: BlueprintOptions = {
      gasLimit,
      salt: salt || null,
      storageDepositLimit,
      value,
    };

    const parsed_wasm = compactAddLength(wasm.slice(0));
    const codeOrBlueprint = codeHash
      ? new BlueprintPromise(api, metadata, codeHash)
      : new CodePromise(api, metadata, wasm && wasm);
    // const transformed = transformUserInput(api.registry, constructor.args, argValues);

    const transformed = transformUserInput(api.registry, constructor.args, argValues);

    const tmp = constructor.toU8a(transformed);
    console.log('constructor.toU8a', tmp);
    console.log('constructor.', transformed);
    //
    // const tx = api.tx.revive.instantiateWithCode(
    //   value!,
    //   gasLimit!,
    //   storageDepositLimit!,
    //   parsed_wasm,
    //   data,
    //   salt,
    // );

    // return tx;

    return constructor.args.length > 0
      ? codeOrBlueprint.tx[constructor.method](options, ...transformed)
      : codeOrBlueprint.tx[constructor.method](options);
  } else {
    throw new Error('Error creating instantiate tx');
  }
}

export async function getContractInfo(api: ApiPromise, address: string) {
  if (isValidAddress(address) || true) {
    return (await api.query.revive.contractInfoOf(address.substring(0, 42))).unwrapOr(null);
  }
}

export async function checkOnChainCode(api: ApiPromise, codeHash: string): Promise<boolean> {
  return isValidCodeHash(codeHash)
    ? (await api.query.contracts.pristineCode(codeHash)).isSome
    : false;
}

export async function filterOnChainCode(api: ApiPromise, items: CodeBundleDocument[]) {
  const codes: CodeBundleDocument[] = [];
  for (const item of items) {
    const isOnChain = await checkOnChainCode(api, item.codeHash);
    isOnChain && codes.push(item);
  }
  return codes;
}

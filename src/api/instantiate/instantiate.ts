// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  DbState,
  OnInstantiateSuccess$Code,
  OnInstantiateSuccess$Hash,
  InstantiateData,
  InstantiateState,
} from 'types';
import { createContract } from 'db';

export function onInsantiateFromHash(
  { db }: DbState,
  { accountId, codeHash, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
): OnInstantiateSuccess$Hash {
  return async function ({ contract, status }): Promise<void> {
    if (accountId && codeHash && contract && (status.isInBlock || status.isFinalized)) {
      await createContract(db, {
        abi: contract.abi.json,
        address: contract.address.toString(),
        creator: accountId,
        codeHash,
        name: name,
        tags: [],
      });

      onSuccess && onSuccess(contract);
    }
  };
}

export function onInstantiateFromCode(
  { db }: DbState,
  { accountId, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
): OnInstantiateSuccess$Code {
  return async function (result): Promise<void> {
    try {
      const { blueprint, contract, status } = result;

      if (accountId && contract && (status.isInBlock || status.isFinalized)) {
        await createContract(db, {
          abi: contract.abi.json,
          address: contract.address.toString(),
          creator: accountId,
          codeHash: blueprint?.codeHash.toHex() || contract.abi.info.source.wasmHash.toHex(),
          name: name,
          tags: [],
        });
        onSuccess && onSuccess(contract, blueprint);
      }
    } catch (e) {
      console.error(e);
    }
  };
}

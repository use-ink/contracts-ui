// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { handleDispatchError } from '../util';
import type {
  InstantiateState,
  ApiState,
  DbState,
  OnInstantiateSuccess$Code,
  OnInstantiateSuccess$Hash,
} from 'types';
import { createContract } from 'db';

export function onInsantiateFromHash(
  { api, blockZeroHash }: ApiState,
  { db, identity }: DbState,
  { accountId, codeHash, name, onSuccess }: InstantiateState
): OnInstantiateSuccess$Hash {
  return async function ({ contract, dispatchError, status }): Promise<void> {
    if (dispatchError) {
      handleDispatchError(dispatchError, api);
    }

    if (accountId.value && codeHash && contract && (status.isInBlock || status.isFinalized)) {
      await createContract(db, identity, {
        abi: contract.abi.json as Record<string, unknown>,
        address: contract.address.toString(),
        creator: accountId.value,
        blockZeroHash: blockZeroHash || undefined,
        codeHash,
        genesisHash: api?.genesisHash.toString(),
        name: name.value,
        tags: [],
      });

      onSuccess && onSuccess(contract);
    }
  };
}

export function onInstantiateFromCode(
  { api, blockZeroHash }: ApiState,
  { db, identity }: DbState,
  { accountId, name, onSuccess }: InstantiateState
): OnInstantiateSuccess$Code {
  return async function (result): Promise<void> {
    try {
      const { blueprint, contract, dispatchError, status } = result;

      if (dispatchError) {
        handleDispatchError(dispatchError, api);
      }

      if (accountId.value && contract && (status.isInBlock || status.isFinalized)) {
        await createContract(db, identity, {
          abi: contract.abi.json as Record<string, unknown>,
          address: contract.address.toString(),
          blockZeroHash: blockZeroHash || undefined,
          creator: accountId.value,
          codeHash: blueprint?.codeHash.toHex() || contract.abi.info.source.wasmHash.toHex(),
          genesisHash: api?.genesisHash.toString(),
          name: name.value,
          tags: [],
        });
        onSuccess && onSuccess(contract, blueprint);
      }
    } catch (e) {
      console.error(e);
    }
  };
}

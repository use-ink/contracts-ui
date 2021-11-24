// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { handleDispatchError } from '../util';
import type {
  ApiState,
  DbState,
  OnInstantiateSuccess$Code,
  OnInstantiateSuccess$Hash,
  InstantiateData,
  InstantiateState,
} from 'types';
import { createContract } from 'db';

export function onInsantiateFromHash(
  { api, blockZeroHash }: ApiState,
  { db, identity }: DbState,
  { accountId, codeHash, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
): OnInstantiateSuccess$Hash {
  return async function ({ contract, dispatchError, status }): Promise<void> {
    if (dispatchError) {
      handleDispatchError(dispatchError, api);
    }

    if (accountId && codeHash && contract && (status.isInBlock || status.isFinalized)) {
      await createContract(db, identity, {
        abi: contract.abi.json,
        address: contract.address.toString(),
        creator: accountId,
        blockZeroHash: blockZeroHash || undefined,
        codeHash,
        genesisHash: api?.genesisHash.toString(),
        name: name,
        tags: [],
      });

      onSuccess && onSuccess(contract);
    }
  };
}

export function onInstantiateFromCode(
  { api, blockZeroHash }: ApiState,
  { db, identity }: DbState,
  { accountId, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
): OnInstantiateSuccess$Code {
  return async function (result): Promise<void> {
    try {
      const { blueprint, contract, dispatchError, status } = result;

      if (dispatchError) {
        handleDispatchError(dispatchError, api);
      }

      if (accountId && contract && (status.isInBlock || status.isFinalized)) {
        await createContract(db, identity, {
          abi: contract.abi.json,
          address: contract.address.toString(),
          blockZeroHash: blockZeroHash || undefined,
          creator: accountId,
          codeHash: blueprint?.codeHash.toHex() || contract.abi.info.source.wasmHash.toHex(),
          genesisHash: api?.genesisHash.toString(),
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

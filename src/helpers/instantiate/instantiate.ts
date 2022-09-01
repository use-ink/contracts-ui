// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DbState, InstantiateData, InstantiateState, BlueprintSubmittableResult } from 'types';

export function onInsantiateSuccess(
  { db }: DbState,
  { accountId, codeHash, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
) {
  return async function ({
    contract,
    status,
  }: BlueprintSubmittableResult<'promise'>): Promise<void> {
    if (accountId && contract?.abi.json && (status.isInBlock || status.isFinalized)) {
      const document = {
        abi: contract.abi.json,
        address: contract.address.toString(),
        codeHash: codeHash || contract.abi.info.source.wasmHash.toHex(),
        date: new Date().toISOString(),
        name,
      };
      await db.contracts.add(document);
      !codeHash && (await db.codeBundles.add(document));

      onSuccess && onSuccess(contract);
    }
  };
}

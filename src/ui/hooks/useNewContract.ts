// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import type { BlueprintSubmittableResult } from 'types';
import { useDatabase, useInstantiate } from 'ui/contexts';

export function useNewContract() {
  const { db } = useDatabase();
  const navigate = useNavigate();
  const {
    data: { accountId, codeHash, name },
  } = useInstantiate();

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
      navigate(`/contract/${contract.address}`);
    }
  };
}

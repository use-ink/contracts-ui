// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import type { BlueprintSubmittableResult } from 'types';
import { useDatabase, useInstantiate } from 'ui/contexts';
import { ApiTypes } from '@polkadot/api/types';

interface ExtendedBlueprintSubmittableResult<T extends ApiTypes>
  extends BlueprintSubmittableResult<T> {
  contractData?: {
    salt: string;
    data: Uint8Array;
    code: string;
    originIsCaller?: boolean;
  };
}

export function useNewContract() {
  const { db } = useDatabase();
  const navigate = useNavigate();
  const instantiate = useInstantiate();

  const {
    data: { accountId, name },
  } = instantiate;

  return async function ({
    contract,
  }: ExtendedBlueprintSubmittableResult<'promise'>): Promise<void> {
    if (accountId && contract?.abi.json) {
      const codeHash = contract.abi.info.source.wasmHash.toHex();
      const document = {
        abi: contract.abi.json,
        address: contract.address.toString(),
        codeHash,
        date: new Date().toISOString(),
        name,
      };

      await Promise.all([
        db.contracts.add(document),
        db.codeBundles.get({ codeHash }).then(codeBundle => {
          if (!codeBundle) {
            return db.codeBundles.add(document);
          }
        }),
      ]);

      navigate(`/contract/${contract.address}`);
    }
  };
}

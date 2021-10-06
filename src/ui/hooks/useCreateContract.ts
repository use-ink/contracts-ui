// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { createContract } from 'db/queries';

import type { ContractDocument } from 'types';

export function useCreateContract(): (
  _: Partial<ContractDocument>
) => Promise<ContractDocument | undefined> {
  const { db, identity } = useDatabase();

  return useCallback(
    async (data: Partial<ContractDocument>): Promise<ContractDocument | undefined> => {
      try {
        return createContract(db, identity, data);
      } catch (e) {
        console.error(e);

        throw e;
      }
    },
    []
  );
}

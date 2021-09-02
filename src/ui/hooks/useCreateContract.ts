// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { createContract } from 'db/queries';

import type { ContractDocument } from 'types';

export function useCreateContract(): (_: Partial<ContractDocument>) => Promise<ContractDocument | undefined> {
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

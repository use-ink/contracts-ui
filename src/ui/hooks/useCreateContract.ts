// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { createContract } from 'db/queries';

import type { ContractDocument } from 'types/db';

export function useCreateContract(): (_: Partial<ContractDocument>) => Promise<string | undefined> {
  const { db, identity } = useDatabase();

  return useCallback(
    async (data: Partial<ContractDocument>): Promise<string | undefined> => {
      try {
        return createContract(db, identity, data);
      } catch (e) {
        console.error(new Error(e));
      }
    },
    [db, identity]
  );
}

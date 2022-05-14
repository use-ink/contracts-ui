// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import type { ContractDocument, DbQuery } from 'types';
import { getContractCollection } from 'db';

export function useTopContracts(): DbQuery<ContractDocument[]> {
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<ContractDocument[] | null> => {
    return await getContractCollection(db).find({}).toArray();
  }, [db]);

  return useDbQuery(query);
}

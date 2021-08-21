// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findTopContracts } from 'db/queries';

import type { ContractDocument, UseQuery } from 'types';

export function useTopContracts(): UseQuery<ContractDocument[]> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<ContractDocument[] | null> => {
    return findTopContracts(db);
  }, []);

  return useQuery(query);
}

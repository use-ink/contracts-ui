// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { getStatistics } from 'db/queries';

import type { DbStatistics, UseQuery } from 'types';

export function useStatistics(): UseQuery<DbStatistics> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<DbStatistics | null> => {
    return getStatistics(db);
  }, []);

  return useQuery(query);
}

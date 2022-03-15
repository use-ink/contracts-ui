// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { getStatistics } from 'db/queries';

import type { DbStatistics, DbQuery } from 'types';

export function useStatistics(): DbQuery<DbStatistics> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<DbStatistics | null> => {
    return getStatistics(db);
  }, [db]);

  return useDbQuery(query);
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { getCodeBundleCollection, getContractCollection } from 'db/queries';

import type { DbStatistics, DbQuery, Database } from 'types';

export async function getStatistics(db: Database): Promise<DbStatistics> {
  const codeBundles = await getCodeBundleCollection(db).find({}).toArray();
  const contractsCount = (await getContractCollection(db).find({}).toArray()).length;

  return { codeBundlesCount: codeBundles.length, contractsCount };
}

export function useStatistics(): DbQuery<DbStatistics> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<DbStatistics | null> => {
    return getStatistics(db);
  }, [db]);

  return useDbQuery(query);
}

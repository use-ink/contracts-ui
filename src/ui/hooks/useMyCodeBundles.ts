// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { findMyCodeBundles } from 'db/queries';

import type { MyCodeBundles, DbQuery } from 'types';

export function useMyCodeBundles(): DbQuery<MyCodeBundles> {
  const { db, identity } = useDatabase();

  const query = useCallback((): Promise<MyCodeBundles | null> => {
    return findMyCodeBundles(db, identity);
  }, [db, identity]);

  return useDbQuery(query);
}
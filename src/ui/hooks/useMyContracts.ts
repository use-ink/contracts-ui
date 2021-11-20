// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { findMyContracts } from 'db/queries';

import type { MyContracts, UseQuery } from 'types';

export function useMyContracts(): UseQuery<MyContracts> {
  const { db, identity } = useDatabase();

  const query = useCallback((): Promise<MyContracts | null> => {
    return findMyContracts(db, identity);
  }, [db, identity]);

  return useDbQuery(query);
}

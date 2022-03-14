import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { findMyContracts } from 'db/queries';

import type { MyContracts, DbQuery } from 'types';

export function useMyContracts(): DbQuery<MyContracts> {
  const { db, identity } = useDatabase();

  const query = useCallback((): Promise<MyContracts | null> => {
    return findMyContracts(db, identity);
  }, [db, identity]);

  return useDbQuery(query);
}

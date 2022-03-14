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

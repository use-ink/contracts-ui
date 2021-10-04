import { useCallback } from 'react';
import { useQuery } from './useQuery';
import { searchForCodeBundle } from 'db';
import type { CodeBundleDocument } from 'types';
import { useDatabase } from 'ui/contexts/DatabaseContext';

export function useCodeBundleSearch(fragment: string) {
  const { db } = useDatabase();

  const query = useCallback((): Promise<CodeBundleDocument[] | null> => {
    return searchForCodeBundle(db, fragment);
  }, [db, fragment]);

  return useQuery(query);
}

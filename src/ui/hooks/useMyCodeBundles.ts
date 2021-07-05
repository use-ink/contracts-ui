// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useQuery } from './useQuery';
import { useDatabase } from 'ui/contexts';
import { findMyCodeBundles } from 'db/queries';

import type { MyCodeBundles, UseQuery } from 'types/db';

export function useMyCodeBundles(): UseQuery<MyCodeBundles> {
  const { db, identity } = useDatabase();

  const query = useCallback((): Promise<MyCodeBundles | null> => {
    return findMyCodeBundles(db, identity);
  }, [db, identity]);

  return useQuery(query);
}

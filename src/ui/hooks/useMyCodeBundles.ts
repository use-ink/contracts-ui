// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findMyCodeBundles } from 'db/queries';

import type { MyCodeBundles, UseQuery } from 'types';

export function useMyCodeBundles(): UseQuery<MyCodeBundles> {
  const { db, identity } = useDatabase();

  const query = useCallback((): Promise<MyCodeBundles | null> => {
    return findMyCodeBundles(db, identity);
  }, []);

  return useQuery(query);
}

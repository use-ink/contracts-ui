// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import type { CodeBundleDocument, UseQuery } from 'types/db';
import { findCodeBundleById  } from 'db/queries';

export function useCodeBundle(id: string): UseQuery<CodeBundleDocument> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<CodeBundleDocument | null> => {
    return findCodeBundleById(db, id);
  }, [id, findCodeBundleById]);

  return useQuery(query);
}

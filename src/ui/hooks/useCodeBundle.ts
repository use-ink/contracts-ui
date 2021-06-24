// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';

import type { CodeBundleDocument, UseQuery } from '@db/types';

export function useCodeBundle(id: string): UseQuery<CodeBundleDocument> {
  const { findCodeBundleById } = useDatabase();

  const findContract = useCallback((): Promise<CodeBundleDocument | null> => {
    return findCodeBundleById(id);
  }, [id, findCodeBundleById]);

  return useQuery(findContract);
}

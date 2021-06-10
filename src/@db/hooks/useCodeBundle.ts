// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import { useCallback } from 'react';
import type { CodeBundleDocument, UseQuery } from '../types';
import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';


export function useCodeBundle(id: string): UseQuery<CodeBundleDocument> {
  const { findCodeBundleById } = useDatabase();

  const findContract = useCallback((): Promise<CodeBundleDocument | null> => {
    return findCodeBundleById(id);
  }, [id, findCodeBundleById]);

  return useQuery(findContract);
}

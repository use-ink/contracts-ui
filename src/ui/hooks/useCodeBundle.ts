// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useQuery } from './useQuery';
import { findCodeBundleByHash  } from 'db/queries';

import type { CodeBundleDocument, UseQuery } from 'types';

export function useCodeBundle(codeHash?: string): UseQuery<CodeBundleDocument> {
  const { blockOneHash } = useCanvas();
  const { db } = useDatabase();

  const query = useCallback((): Promise<CodeBundleDocument | null> => {
    if (!codeHash) {
      return Promise.resolve(null);
    }
    return findCodeBundleByHash(db, { blockOneHash, codeHash });
  }, [codeHash, findCodeBundleByHash]);

  return useQuery(query);
}

// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findOwnedCodeBundles, findTopCodeBundles } from 'db/queries';

import type { CodeBundleDocument, UseQuery } from 'types';

type ReturnType = [CodeBundleDocument[], CodeBundleDocument[]];

export function useAvailableCodeBundles(limit = 2): UseQuery<ReturnType> {
  const { db, identity } = useDatabase();

  const query = useCallback(async (): Promise<ReturnType> => {
    const owned = await findOwnedCodeBundles(db, identity, limit);

    const popular = await findTopCodeBundles(db, identity, limit);

    return [owned, popular];
  }, []);

  return useQuery(query);
}

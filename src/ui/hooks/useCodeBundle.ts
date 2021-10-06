// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findCodeBundleById } from 'db/queries';

import type { CodeBundleDocument, UseQuery } from 'types';

export function useCodeBundle(id: string): UseQuery<CodeBundleDocument> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<CodeBundleDocument | null> => {
    return findCodeBundleById(db, id);
  }, [id, findCodeBundleById]);

  return useQuery(query);
}

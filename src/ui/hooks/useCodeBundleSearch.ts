// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useDbQuery } from './useDbQuery';
import { searchForCodeBundle } from 'db';
import type { CodeBundleDocument } from 'types';
import { useDatabase } from 'ui/contexts/DatabaseContext';
import { filterOnChainCode } from 'api/util';
import { useApi } from 'ui/contexts';

export function useCodeBundleSearch(fragment: string) {
  const { db } = useDatabase();
  const { api } = useApi();

  const query = useCallback(async (): Promise<CodeBundleDocument[]> => {
    const searchResults = await searchForCodeBundle(db, fragment);
    return await filterOnChainCode(api, searchResults || []);
  }, [api, db, fragment]);

  return useDbQuery(query);
}

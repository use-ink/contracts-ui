// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import compareDesc from 'date-fns/compareDesc';
import parseISO from 'date-fns/parseISO';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { findOwnedCodeBundles } from 'db/queries';

import type { CodeBundleDocument, DbQuery } from 'types';

function byDate(a: CodeBundleDocument, b: CodeBundleDocument): number {
  return compareDesc(parseISO(a.date), parseISO(b.date));
}

export function useAvailableCodeBundles(limit = 1): DbQuery<CodeBundleDocument[]> {
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<CodeBundleDocument[]> => {
    return (await findOwnedCodeBundles(db, limit)).sort(byDate);
  }, [db, limit]);

  return useDbQuery(query);
}

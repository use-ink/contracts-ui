// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import compareDesc from 'date-fns/compareDesc';
import parseISO from 'date-fns/parseISO';
import { useDatabase } from '../contexts';
import { useDbQuery } from './useDbQuery';
import { findOwnedCodeBundles, findTopCodeBundles } from 'db/queries';

import type { CodeBundleDocument, DbQuery } from 'types';

type ReturnType = [CodeBundleDocument[], CodeBundleDocument[]];

function byDate(a: CodeBundleDocument, b: CodeBundleDocument): number {
  return compareDesc(parseISO(a.date), parseISO(b.date));
}

export function useAvailableCodeBundles(limit = 1): DbQuery<ReturnType> {
  const { db, identity } = useDatabase();

  const query = useCallback(async (): Promise<ReturnType> => {
    const owned = (await findOwnedCodeBundles(db, identity, limit)).sort(byDate);

    const popular = (await findTopCodeBundles(db, identity, limit)).sort(byDate);

    return [owned, popular];
  }, [db, identity, limit]);

  return useDbQuery(query);
}

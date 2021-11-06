// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findOwnedCodeBundles, findTopCodeBundles } from 'db/queries';

import type { CodeBundleDocument, UseQuery } from 'types';

type ReturnType = [CodeBundleDocument[], CodeBundleDocument[]];

function byDate(a: CodeBundleDocument, b: CodeBundleDocument): number {
  return moment(b.date).valueOf() - moment(a.date).valueOf();
}

export function useAvailableCodeBundles(limit = 1): UseQuery<ReturnType> {
  const { db, identity } = useDatabase();

  const query = useCallback(async (): Promise<ReturnType> => {
    const owned = (await findOwnedCodeBundles(db, identity, limit)).sort(byDate);

    const popular = (await findTopCodeBundles(db, identity, limit)).sort(byDate);

    return [owned, popular];
  }, []);

  return useQuery(query);
}

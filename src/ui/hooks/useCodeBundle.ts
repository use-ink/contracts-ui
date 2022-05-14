// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useDbQuery } from './useDbQuery';
import { getCodeBundleCollection } from 'db/queries';

import type { CodeBundle, DbQuery, OrFalsy } from 'types';

function isValidHash(input: OrFalsy<string>): boolean {
  const codeHashRegex = /^0x[0-9a-fA-F]{64}$/;
  return !!input && codeHashRegex.test(input);
}

export function useCodeBundle(codeHash: string): DbQuery<CodeBundle> {
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<CodeBundle> => {
    if (isValidHash(codeHash)) {
      const document = await getCodeBundleCollection(db).findOne({ codeHash });
      return { document };
    }
    return { document: undefined };
  }, [codeHash, db]);

  return useDbQuery(query, result => !!result);
}

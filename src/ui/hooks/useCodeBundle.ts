// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useDbQuery } from './useDbQuery';
import { findCodeBundleByHash } from 'db/queries';

import type { CodeBundle, DbQuery, OrFalsy } from 'types';

function isValidHash(input: OrFalsy<string>): boolean {
  const codeHashRegex = /^0x[0-9a-fA-F]{64}$/;
  return !!input && codeHashRegex.test(input);
}

export function useCodeBundle(codeHash: string): DbQuery<CodeBundle> {
  const { api } = useApi();
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<CodeBundle> => {
    if (isValidHash(codeHash)) {
      const isOnChain = !(await api.query.contracts.codeStorage(codeHash)).isEmpty;
      const document = await findCodeBundleByHash(db, codeHash);
      return { document, isOnChain };
    }
    return { document: null, isOnChain: false };
  }, [api.query.contracts, codeHash, db]);

  return useDbQuery(query, result => !!result);
}

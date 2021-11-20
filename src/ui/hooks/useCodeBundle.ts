// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

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

export function useCodeBundle(codeHash: string | null): DbQuery<CodeBundle> {
  const { api, blockZeroHash } = useApi();
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<CodeBundle> => {
    if (isValidHash(codeHash) && typeof codeHash === 'string') {
      const isOnChain = !(await api.query.contracts.codeStorage(codeHash)).isEmpty;
      const document = await findCodeBundleByHash(db, { blockZeroHash, codeHash });
      return { document, isOnChain };
    }
    return { document: null, isOnChain: false };
  }, [api.query.contracts, blockZeroHash, codeHash, db]);

  return useDbQuery(query, result => !!result);
}

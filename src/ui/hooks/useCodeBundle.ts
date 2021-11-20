// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useDbQuery } from './useDbQuery';
import { findCodeBundleByHash } from 'db/queries';

import { Abi } from 'types';
import type { AnyJson, CodeBundleDocument, UseQuery } from 'types';

type ReturnType = [boolean, CodeBundleDocument | null, Abi | null];

const codeHashRegex = /^0x[0-9a-fA-F]{64}$/;

export function useCodeBundle(codeHash?: string | null): UseQuery<ReturnType> {
  const { api, blockZeroHash } = useApi();
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<ReturnType> => {
    if (!codeHash || !codeHashRegex.test(codeHash)) {
      return Promise.resolve([false, null, null]);
    }

    const isOnChain = (await api.query.contracts.codeStorage(codeHash)).isSome;

    if (!isOnChain) {
      return [false, null, null];
    }

    const document = await findCodeBundleByHash(db, { blockZeroHash, codeHash });

    return [true, document, document ? new Abi(document.abi as AnyJson) : null];
  }, [api.query.contracts, blockZeroHash, codeHash, db]);

  return useDbQuery(query, result => !!result && result[0]);
}

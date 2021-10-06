// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { useQuery } from './useQuery';
import { findContractByAddress } from 'db/queries';

import type { ContractDocument, UseQuery } from 'types';

export function useContract(address: string): UseQuery<ContractDocument> {
  const { db } = useDatabase();

  const query = useCallback((): Promise<ContractDocument | null> => {
    return findContractByAddress(db, address);
  }, [address, findContractByAddress]);

  return useQuery(query);
}

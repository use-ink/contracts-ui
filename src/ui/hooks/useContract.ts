// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';

import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';

import type { ContractDocument, UseQuery } from '@db/types';

export function useContract(address: string): UseQuery<ContractDocument> {
  const { findContractByAddress } = useDatabase();

  const findContract = useCallback((): Promise<ContractDocument | null> => {
    return findContractByAddress(address);
  }, [address, findContractByAddress]);

  return useQuery(findContract);
}

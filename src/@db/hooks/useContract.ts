// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import { useCallback } from 'react';
import type { ContractDocument, UseQuery } from '../types';

import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';

export function useContract(address: string): UseQuery<ContractDocument> {
  const { findContractByAddress } = useDatabase();

  const findContract = useCallback((): Promise<ContractDocument | null> => {
    return findContractByAddress(address);
  }, [address, findContractByAddress]);

  return useQuery(findContract);
}

// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useQuery } from './useQuery';
import { findContractByAddress  } from 'db/queries';

import { Abi, AnyJson, ContractPromise as Contract, UseQuery } from 'types';
import { useCanvas } from 'ui/contexts';

export function useContract(address: string): UseQuery<Contract> {
  const { api } = useCanvas();
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<Contract | null> => {
    const document = await findContractByAddress(db, address);

    return api && document
      ? new Contract(api, new Abi(document.abi as AnyJson), address)
      : null;
  }, [api, address, findContractByAddress]);

  return useQuery(query);
}

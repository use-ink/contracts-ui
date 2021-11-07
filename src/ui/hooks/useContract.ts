// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useQuery } from './useQuery';
import { findContractByAddress } from 'db/queries';

import { Abi, AnyJson, ContractDocument, ContractPromise as Contract, UseQuery } from 'types';
import { useApi } from 'ui/contexts';

type ReturnType = [Contract | null, ContractDocument | null];

export function useContract(address: string): UseQuery<ReturnType> {
  const { api } = useApi();
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<ReturnType> => {
    const document = await findContractByAddress(db, address);

    return api && document
      ? [new Contract(api, new Abi(document.abi as AnyJson), address), document]
      : [null, null];
  }, [db, address, api]);

  return useQuery(query, result => !!result && !!result[0]);
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useDbQuery } from './useDbQuery';
import { findContractByAddress } from 'db/queries';

import { Abi, ContractDocument, ContractPromise as Contract, DbQuery } from 'types';
import { useApi } from 'ui/contexts';

type ReturnType = [Contract | null, ContractDocument | null];

export function useContract(address: string): DbQuery<ReturnType> {
  const { api } = useApi();
  const { db } = useDatabase();

  const query = useCallback(async (): Promise<ReturnType> => {
    const document = await findContractByAddress(db, address);

    return api && document
      ? [new Contract(api, new Abi(document.abi), address), document]
      : [null, null];
  }, [db, address, api]);

  return useDbQuery(query, result => !!result && !!result[0]);
}

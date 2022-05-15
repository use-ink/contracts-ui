// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useDatabase } from '../contexts/DatabaseContext';

import { useDbQuery } from './useDbQuery';
import { Abi, ContractDocument, ContractPromise as Contract } from 'types';
import { useApi } from 'ui/contexts';

type ReturnType = [Contract | null, ContractDocument | null, boolean];

export function useContract(address: string): ReturnType {
  const { api } = useApi();
  const { db } = useDatabase();

  const [document, isLoading] = useDbQuery(() => db.contracts.get({ address }), [address]);

  return [
    api && document ? new Contract(api, new Abi(document.abi), address) : null,
    document || null,
    isLoading,
  ];
}

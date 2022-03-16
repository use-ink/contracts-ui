/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useBalance } from './useBalance';
import { useApi } from 'ui/contexts/ApiContext';
import type { OrFalsy, ValidFormField } from 'types';

export interface UseStorageDepositLimit extends ValidFormField<BN> {
  maximum: BN | null;
}

export function useStorageDepositLimit(accountId: OrFalsy<string>): UseStorageDepositLimit {
  const { api } = useApi();
  const [maximum, setMaximum] = useState<BN | null>(null);

  const storageDepositLimit = useBalance(0, { maxValue: maximum || undefined });

  useEffect((): void => {
    accountId &&
      api.derive.balances
        .account(accountId)
        .then(({ freeBalance }) => setMaximum(freeBalance))
        .catch(console.error);
  }, [accountId, api]);

  return {
    ...storageDepositLimit,
    maximum,
  };
}

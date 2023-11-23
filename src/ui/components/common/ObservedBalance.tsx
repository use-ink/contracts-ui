// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { formatBalance } from 'lib/formatBalance';
import { Balance } from 'types';
import { useApi } from 'ui/contexts';

export const ObservedBalance = ({ address }: { address: string }) => {
  const { api, tokenDecimals, tokenSymbol } = useApi();

  const [balance, setBalance] = useState<null | Balance>(null);
  useEffect(() => {
    const unsubscribePromise = api.query.system.account(address, result => {
      setBalance(result.data.free);
    });

    return () => {
      unsubscribePromise
        .then(unsubscribe => {
          unsubscribe();
        })
        .catch(console.error);
    };
  }, [address, api]);

  if (!balance) return null;
  return formatBalance(balance, tokenDecimals, tokenSymbol);
};

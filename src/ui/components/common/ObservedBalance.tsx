// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useApi } from '../../contexts';
import { Balance } from 'types';

const formatBalance = (balance: Balance, decimals = 12, unit?: string) => {
  const balanceAsBigInt = balance.toBigInt();
  const prefix = balanceAsBigInt / BigInt(10 ** decimals);
  const suffix = balanceAsBigInt - prefix * BigInt(10 ** decimals);
  const number = Number(`${prefix.toString()}.${suffix.toString().slice(0, 2)}`);

  return (
    Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      number,
    ) + (unit ? ` ${unit}` : '')
  );
};

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

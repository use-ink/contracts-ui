// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { keyring } from '@polkadot/ui-keyring';
import { useMemo } from 'react';

export const useAccountAvailable = (accountId?: string): boolean | undefined =>
  useMemo(() => {
    if (accountId === '' || accountId === undefined) return undefined;
    try {
      keyring.getPair(accountId);
      return true;
    } catch {
      return false;
    }
  }, [accountId]);

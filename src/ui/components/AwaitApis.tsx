// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { web3EnablePromise } from '@polkadot/extension-dapp';
import { AccountsError, ExtensionError } from './common/AccountsError';
import { useApi, useDatabase } from 'ui/contexts';
import { Loader, ConnectionError } from 'ui/components/common';

export function AwaitApis({ children }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { accounts, api, endpoint } = useApi();
  const { db } = useDatabase();
  const [message, setMessage] = useState('');

  const isLoading = !db || !api;

  useEffect(() => {
    !db && setMessage('Loading data...');
    !api && setMessage(`Connecting to ${endpoint}...`);
  }, [db, endpoint, api]);

  if (web3EnablePromise && accounts?.length === 0) {
    return <AccountsError />;
  }

  if (!web3EnablePromise) {
    return <ExtensionError />;
  }

  if (api?.errors) {
    return <ConnectionError />;
  }

  return <>{isLoading ? <Loader message={message} isLoading /> : children}</>;
}

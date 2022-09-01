// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { AccountsError, ExtensionError } from './common/AccountsError';
import { useApi, useDatabase } from 'ui/contexts';
import { Loader, ConnectionError } from 'ui/components/common';
import { isKeyringLoaded } from 'helpers';

export function AwaitApis({ children }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { accounts, api, endpoint, status, systemChainType } = useApi();
  const { db } = useDatabase();
  const [message, setMessage] = useState('');

  useEffect(() => {
    !db && setMessage('Loading data...');
    status === 'loading' && setMessage(`Connecting to ${endpoint}...`);
  }, [db, endpoint, api, status]);

  if (isWeb3Injected && accounts?.length === 0) {
    return <AccountsError />;
  }

  if (
    !isWeb3Injected &&
    status === 'connected' &&
    !systemChainType.isDevelopment &&
    isKeyringLoaded()
  ) {
    return <ExtensionError />;
  }

  if (status === 'error') {
    return <ConnectionError />;
  }

  return <>{status === 'loading' || !db ? <Loader message={message} isLoading /> : children}</>;
}

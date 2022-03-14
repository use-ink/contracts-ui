// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from './common/Loader';
import { useApi, useDatabase } from 'ui/contexts';

export function AwaitApis({ children }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { t } = useTranslation();
  const { error, status, keyringStatus } = useApi();
  const { isDbReady } = useDatabase();

  const [isLoading, message] = useMemo((): [boolean, string | null] => {
    if (error) {
      return [true, `${t('connectionError', `Connection error`)}...`];
    }

    if (!isDbReady) {
      return [true, `${t('initializingDatabase', 'Initializing database')}...`];
    }

    if (keyringStatus !== 'READY') {
      return [true, `${t('loadingAccounts', 'Loading accounts')}...`];
    }

    if (status !== 'READY') {
      return [true, `${t('connecting', 'Connecting')}...`];
    }

    return [false, null];
  }, [t, error, keyringStatus, status, isDbReady]);

  return (
    <Loader isLoading={isLoading} message={message}>
      {children}
    </Loader>
  );
}

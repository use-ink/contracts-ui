// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { Loader } from './common/Loader';
import { useApi, useDatabase } from 'ui/contexts';

export function AwaitApis({ children }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { error, status, keyringStatus } = useApi();
  const { isDbReady } = useDatabase();

  const [isLoading, message] = useMemo((): [boolean, string | null] => {
    if (error) {
      return [true, `Connection error`];
    }

    if (!isDbReady) {
      return [true, 'Initializing database...'];
    }

    if (keyringStatus !== 'READY') {
      return [true, 'Loading accounts...'];
    }

    if (status !== 'READY') {
      return [true, 'Connecting...'];
    }

    return [false, null];
  }, [error, keyringStatus, status, isDbReady]);

  return (
    <Loader isLoading={isLoading} message={message}>
      {children}
    </Loader>
  );
}

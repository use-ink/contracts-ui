// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import type { UseQuery } from 'types';

type ValidateFn<T> = (_?: T | null) => boolean;

export function useQuery<T>(
  query: () => Promise<T | null>,
  validate: ValidateFn<T> = value => !!value
): UseQuery<T> {
  const { isDbReady } = useDatabase();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(0);

  const fetch = useCallback((): void => {
    if (!isDbReady) return;

    query()
      .then(result => {
        setData(result);
        setError(null);
        setIsLoading(false);
        setIsValid(validate(result));
        setUpdated(Date.now());
      })
      .catch((e: Error) => {
        setIsValid(false);
        e.message && setError(e.message);
        console.error(e);
      });
  }, [isDbReady, query]);

  const refresh = useCallback((): void => {
    setError(null);
    setIsLoading(true);
    setIsValid(true);
    fetch();
  }, [fetch]);

  useEffect((): void => {
    fetch();
  }, [fetch]);

  return { data, error, isLoading, isValid, refresh, updated };
}

// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import type { VoidFn } from 'types';

type ValidateFn<T> = (_?: T | null) => boolean;

interface State<T> {
  data: T | null;
  error: React.ReactNode | null;
  isLoading: boolean;
  isValid: boolean;
  updated: number;
}

interface UseQuery<T> extends State<T> {
  refresh: VoidFn;
}

const initialState = {
  data: null,
  error: null,
  isLoading: true,
  isValid: true,
  updated: 0,
};

export function useQuery<T>(
  query: () => Promise<T | null>,
  validate: ValidateFn<T> = value => !!value
): UseQuery<T> {
  const { isDbReady } = useDatabase();
  const [state, setState] = useState<State<T>>(initialState);

  const fetch = useCallback((): void => {
    if (!isDbReady) return;

    query()
      .then(result => {
        setState(state => ({
          ...state,
          data: result,
          error: null,
          isLoading: false,
          isValid: validate(result),
          updated: Date.now(),
        }));
      })
      .catch((e: Error) => {
        setState(state => ({
          ...state,
          data: null,
          error: e.message || 'Error',
          isLoading: false,
          isValid: false,
          updated: Date.now(),
        }));

        console.error(e);
      });
  }, [isDbReady, query]);

  const refresh = useCallback((): void => {
    setState(state => ({
      ...state,
      error: null,
      isLoading: true,
      isValid: true,
    }));

    fetch();
  }, [fetch]);

  useEffect((): void => {
    fetch();
  }, [fetch]);

  return { ...state, refresh };
}

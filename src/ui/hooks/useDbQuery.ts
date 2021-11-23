// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import type { DbQuery } from 'types';

type ValidateFn<T> = (_?: T | null) => boolean;

type State<T> = Omit<DbQuery<T>, 'refresh'>;

const initialState = {
  data: null,
  error: null,
  isLoading: true,
  isValid: true,
  updated: 0,
};

export function useDbQuery<T>(
  query: () => Promise<T | null>,
  validate: ValidateFn<T> = value => !!value
): DbQuery<T> {
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
    // validate updates too often
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

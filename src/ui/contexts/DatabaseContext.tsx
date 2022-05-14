// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiContext';
import { init } from 'db/util';
import type { DbState } from 'types';
import { getContractCollection } from 'db';

export const DbContext: React.Context<DbState> = createContext({} as unknown as DbState);
export const DbConsumer: React.Consumer<DbState> = DbContext.Consumer;
export const DbProvider: React.Provider<DbState> = DbContext.Provider;

const INITIAL = { isDbReady: false } as unknown as DbState;

export function DatabaseContextProvider({
  children,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { status, endpoint } = useApi();

  const [state, setState] = useState<DbState>(INITIAL);

  useEffect((): void => {
    status === 'READY' &&
      init(endpoint)
        .then((db): void => {
          setState(state => ({ ...state, db, isDbReady: true }));
        })
        .catch(e => {
          console.error(e);
        });
  }, [endpoint, status]);

  const refreshUserData = useCallback(async (): Promise<void> => {
    const myContracts = await getContractCollection(state.db).find().toArray();

    setState(state => ({ ...state, myContracts }));
  }, [state.db]);

  useEffect((): void => {
    if (state.isDbReady) {
      refreshUserData().catch(console.error);
    }
  }, [refreshUserData, state.isDbReady]);

  return <DbContext.Provider value={{ ...state, refreshUserData }}>{children}</DbContext.Provider>;
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}

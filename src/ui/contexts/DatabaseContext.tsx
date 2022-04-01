// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useApi } from './ApiContext';
import { init } from 'db/util';
import type { DbState } from 'types';
import { findMyContracts, getUser } from 'db';

export const DbContext: React.Context<DbState> = createContext({} as unknown as DbState);
export const DbConsumer: React.Consumer<DbState> = DbContext.Consumer;
export const DbProvider: React.Provider<DbState> = DbContext.Provider;

const INITIAL = { isDbReady: false } as unknown as DbState;

export function DatabaseContextProvider({
  children,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { status, genesisHash, endpoint } = useApi();

  const [state, setState] = useState<DbState>(INITIAL);

  useEffect((): void => {
    status === 'READY' &&
      !!genesisHash &&
      init(endpoint, genesisHash)
        .then(([db, user, identity]): void => {
          setState(state => ({ ...state, db, user, identity, isDbReady: true }));
        })
        .catch(e => {
          console.error(e);
        });
  }, [genesisHash, endpoint, status]);

  const refreshUserData = useCallback(async (): Promise<void> => {
    const user = await getUser(state.db, state.identity);
    const myContracts = await findMyContracts(state.db, state.identity);

    setState(state => ({ ...state, user, myContracts }));
  }, [state.db, state.identity]);

  useEffect((): void => {
    if (state.isDbReady) {
      refreshUserData().then().catch(console.error);
    }
  }, [refreshUserData, state.isDbReady]);

  return <DbContext.Provider value={{ ...state, refreshUserData }}>{children}</DbContext.Provider>;
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}

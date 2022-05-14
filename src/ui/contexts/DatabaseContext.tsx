// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiContext';
import { DB } from 'db';

export const DbContext: React.Context<DbState> = createContext({} as unknown as DbState);
export const DbConsumer: React.Consumer<DbState> = DbContext.Consumer;
export const DbProvider: React.Provider<DbState> = DbContext.Provider;

const INITIAL = { isDbReady: false } as unknown as DbState;

interface DbState {
  db: DB;
  isDbReady: boolean;
}

export function DatabaseContextProvider({
  children,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { api, status, endpoint } = useApi();

  const [state, setState] = useState<DbState>(INITIAL);

  useEffect((): void => {
    status === 'READY' &&
      !!api.genesisHash &&
      setState({
        isDbReady: true,
        db: new DB(api.genesisHash.toHex()),
      });
  }, [api.genesisHash, endpoint, status]);

  // const refreshUserData = useCallback(async (): Promise<void> => {
  //   const user = await getUser(state.db, state.identity);
  //   const myContracts = await findMyContracts(state.db, state.identity);

  //   setState(state => ({ ...state, user, myContracts }));
  // }, [state.db, state.identity]);

  // useEffect((): void => {
  //   if (state.isDbReady) {
  //     refreshUserData().then().catch(console.error);
  //   }
  // }, [refreshUserData, state.isDbReady]);

  return <DbContext.Provider value={state}>{children}</DbContext.Provider>;
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}

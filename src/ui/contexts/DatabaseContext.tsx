// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { PrivateKey } from '@textile/crypto';
import { Database as DB } from '@textile/threaddb';
import React, { HTMLAttributes, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCanvas } from './CanvasContext';
import { init } from 'db/util';
import type { DbState, UserDocument } from 'types';
import { dropExpiredDocuments, getUser } from 'db';

export const DbContext: React.Context<DbState> = React.createContext({} as unknown as DbState);
export const DbConsumer: React.Consumer<DbState> = DbContext.Consumer;
export const DbProvider: React.Provider<DbState> = DbContext.Provider;

export function DatabaseContextProvider({
  children,
}: HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { status, blockOneHash, endpoint } = useCanvas();
  const [db, setDb] = useState<DB>(new DB(''));
  const [identity, setIdentity] = useState<PrivateKey | null>(null);
  const [user, setUser] = useState<UserDocument | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const isRemote = useMemo(
    (): boolean => false, // !isDevelopment
    []
  );

  const resetLocalDb = useCallback(
    async (): Promise<void> => {
      if (!!blockOneHash && !isRemote) {
        try {
          await dropExpiredDocuments(db, blockOneHash);
        } catch (e) {
          console.error(e);
        } finally {
          setIsDbReady(true);
        }
      }
    },
    [blockOneHash, isRemote]
  )

  // initial initialization
  useEffect((): void => {
    async function createDb() {
      try {
        const [db, user, identity] = await init(endpoint, isRemote);

        setDb(db);
        setIdentity(identity);
        setUser(user);

        if (isRemote) {
          setIsDbReady(true);
        }
      } catch (e) {
        console.error(e);
      }
    }

    createDb()
      .then(resetLocalDb)
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, status]);

  const refreshUser = useCallback(
    async (): Promise<void> => {
      const user = await getUser(db, identity);

      setUser(user);
    },
    [db, identity]
  );

  const props = useMemo<DbState>(
    () => ({ db, identity, isDbReady, refreshUser, user }),
    [db, identity, isDbReady, user]
  );

  return (
    <DbContext.Provider value={props}>
      {children}
    </DbContext.Provider>
  );
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}

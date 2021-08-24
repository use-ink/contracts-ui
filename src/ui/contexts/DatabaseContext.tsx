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
  const { blockOneHash, endpoint } = useCanvas();
  const [db, setDb] = useState<DB>(new DB(''));
  const [identity, setIdentity] = useState<PrivateKey | null>(null);
  const [user, setUser] = useState<UserDocument | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const isRemote = useMemo(
    (): boolean => false, // !isDevelopment
    []
  );

  // initial initialization
  useEffect((): void => {
    async function createDb() {
      if (blockOneHash) {
        try {
          const [db, user, identity] = await init(endpoint, isRemote);

          if (!isRemote) {
            await dropExpiredDocuments(db, blockOneHash);
          }

          setDb(db);
          setIdentity(identity);
          setUser(user);
          setIsDbReady(true);
        } catch (e) {
          console.error(e);
          setDb(new DB(''));
        }
      }
    }

    createDb()
      .then()
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockOneHash]);

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

  if (!db || !props.isDbReady) {
    return null;
  }

  return <DbContext.Provider value={props}>{children}</DbContext.Provider>;
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}

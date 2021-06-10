// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import '@polkadot/x-textencoder';
import '@polkadot/x-textdecoder';
import { PrivateKey } from '@textile/crypto';
import { Database as DB } from '@textile/threaddb';
import React, { HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import { DbContext } from '../contexts';
import { init } from '../util';

import type { DbProps } from '../types';
import { useCanvas } from '@canvas/hooks';

export function Database({ children }: HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { endpoint } = useCanvas();
  const [db, setDb] = useState<DB>(new DB(''));
  const [identity, setIdentity] = useState<PrivateKey | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const isRemote = useMemo(
    (): boolean => false, // !isDevelopment
    []
  );

  // initial initialization
  useEffect((): void => {
    async function createDb() {
      try {
        const [db, identity] = await init(endpoint, isRemote);

        setDb(db);
        setIdentity(identity);
        setIsDbReady(true);
      } catch (e) {
        console.error(e);
        setDb(new DB(''));
      }
    }

    createDb()
      .then()
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = useCallback(async (): Promise<void> => {
    if (isRemote) {
      await db.remote.push();
    }
  }, [isRemote, db]);

  const props = useMemo<DbProps>(
    () => ({ db, identity, isDbReady, sync }),
    [db, identity, isDbReady, sync]
  );

  if (!db || !props.isDbReady) {
    return null;
  }

  return <DbContext.Provider value={props}>{children}</DbContext.Provider>;
}

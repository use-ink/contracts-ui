// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '../contexts';
import type { UseQuery } from 'types';

export function useQuery<T>(query: () => Promise<T | null>): UseQuery<T> {
  const { isDbReady } = useDatabase();
  const [data, setData] = useState<T | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(0);

  const fetch = useCallback((): void => {
    if (!isDbReady) return;

    query()
      .then(result => {
        setData(result);
        setData(result);
        setIsLoading(false);
        setIsValid(!!result);
        setUpdated(Date.now());
      })
      .catch(e => console.error(e));
  }, [isDbReady, query]);

  const refresh = useCallback((): void => {
    setIsLoading(true);
    fetch();
  }, [fetch]);

  useEffect((): void => {
    fetch();
  }, []);

  return { data, isLoading, isValid, refresh, updated };
}

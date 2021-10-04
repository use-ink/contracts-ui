// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useIsMounted } from './useIsMounted';
import type { OrFalsy, OrNull, UseQuery } from 'types';

type ValidateFn<T> = (_: OrFalsy<T>) => boolean;

export function useQuery<T>(
  query: () => Promise<OrNull<T>>,
  validate: ValidateFn<T> = value => !!value
): UseQuery<T> {
  const isMounted = useIsMounted();
  const { isDbReady } = useDatabase();
  const [data, setData] = useState<OrNull<T>>(null);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(0);

  const fetch = useCallback((): void => {
    if (!isDbReady) return;

    query()
      .then(result => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
          setIsValid(validate(result));
          setUpdated(Date.now());
        }
      })
      .catch(e => {
        setIsLoading(false);
        setIsValid(false);
        setUpdated(Date.now());

        console.error(e);
      });
  }, [isDbReady, isMounted, query]);

  const refresh = useCallback((): void => {
    setIsLoading(true);
    setIsValid(true);
    fetch();
  }, [fetch]);

  useEffect((): void => {
    isMounted && fetch();
  }, [isMounted, fetch]);

  return { data, isLoading, isValid, refresh, updated };
}

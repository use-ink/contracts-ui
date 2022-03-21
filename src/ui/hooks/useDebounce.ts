// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';

import { useIsMounted } from './useIsMounted';

const DEFAULT_DELAY = 250;

// FIXE Due to generics, cannot use createNamedHook
export function useDebounce<T>(value: T, delay?: number): T {
  const isMounted = useIsMounted();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect((): (() => void) => {
    const handler = setTimeout(() => {
      isMounted && setDebouncedValue(value);
    }, delay || DEFAULT_DELAY);

    // each time it renders, it clears
    return (): void => {
      clearTimeout(handler);
    };
  }, [delay, value, isMounted]);

  return debouncedValue;
}

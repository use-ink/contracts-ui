// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (_: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item
        ? typeof initialValue !== 'string'
          ? (JSON.parse(item) as T)
          : (item as unknown as T)
        : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? (value(storedValue) as T) : value;
      setStoredValue(valueToStore);

      window.localStorage.setItem(
        key,
        typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

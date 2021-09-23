import React, { useCallback, useState } from 'react';

import type { VoidFn } from '@polkadot/api/types';

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>]

export function useStepper (initialValue = 0, maxValue = 2): UseStepper {
  const [value, setValue] = useState(Math.min(initialValue, maxValue));

  const increment = useCallback(
    (): void => {
      setValue(Math.min(maxValue, value + 1));
    },
    [value]
  );

  const decrement = useCallback(
    (): void => {
      setValue(Math.max(0, value - 1));
    },
    [value]
  );

  return [value, increment, decrement, setValue];
}

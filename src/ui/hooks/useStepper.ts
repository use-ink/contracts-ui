// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';

import type { UseStepper } from 'types';

export function useStepper(initialValue = 0, maxValue = 3): UseStepper {
  const [value, setValue] = useState(Math.min(initialValue, maxValue));

  const increment = useCallback((): void => {
    setValue(Math.min(maxValue, value + 1));
  }, [maxValue, value]);

  const decrement = useCallback((): void => {
    setValue(Math.max(initialValue, value - 1));
  }, [initialValue, value]);

  return [value, increment, decrement, setValue];
}

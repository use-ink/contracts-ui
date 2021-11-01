// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import { useIsMountedRef } from './useIsMountedRef';
import type { UseToggle } from 'types';

// Simple wrapper for a true/false toggle
export function useToggle(defaultValue = false, onToggle?: (isActive: boolean) => void): UseToggle {
  const mountedRef = useIsMountedRef();
  const [isActive, setActive] = useState(defaultValue);

  const _toggleActive = useCallback((): void => {
    mountedRef.current && setActive(isActive => !isActive);
  }, [mountedRef]);

  const _setActive = useCallback(
    (isActive: boolean): void => {
      mountedRef.current && setActive(isActive);
    },
    [mountedRef]
  );

  useEffect(() => onToggle && onToggle(isActive), [isActive, onToggle]);

  return [isActive, _toggleActive, _setActive];
}

import { useCallback, useEffect, useState } from 'react';

import { useIsMountedRef } from './useIsMountedRef';

export type Toggle = [boolean, () => void, (value: boolean) => void];

// Simple wrapper for a true/false toggle
export function useToggle (defaultValue = false, onToggle?: (isActive: boolean) => void): Toggle {
  const mountedRef = useIsMountedRef();
  const [isActive, setActive] = useState(defaultValue);

  const _toggleActive = useCallback(
    (): void => {
      mountedRef.current && setActive((isActive) => !isActive);
    },
    [mountedRef]
  );

  const _setActive = useCallback(
    (isActive: boolean): void => {
      mountedRef.current && setActive(isActive);
    },
    [mountedRef]
  );

  useEffect(
    () => onToggle && onToggle(isActive),
    [isActive, onToggle]
  );

  return [isActive, _toggleActive, _setActive];
}

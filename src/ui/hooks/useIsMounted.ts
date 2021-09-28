import { useEffect, useRef } from 'react';

export function useIsMounted (): boolean {
  const isMountedRef = useRef(false);

  useEffect((): () => void => {
    isMountedRef.current = true;

    return (): void => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef.current;
}

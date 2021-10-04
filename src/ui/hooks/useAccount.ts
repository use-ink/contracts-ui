import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { useMemo } from 'react';
import { useCanvas } from 'ui/contexts';

export function useAccount(address?: string | null): KeyringAddress | null {
  const { keyring } = useCanvas();

  return useMemo((): KeyringAddress | null => {
    if (keyring && address) {
      return keyring?.getAccount(address) || null;
    }

    return null;
  }, [keyring, address]);
}

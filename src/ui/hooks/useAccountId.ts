import { useCallback } from 'react';
import { useFormField } from './useFormField';
import type { OrNull, UseFormField } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';

type AccountId = OrNull<string>;

export type UseAccountId = UseFormField<AccountId>;

export function useAccountId(initialValue: AccountId = null): UseAccountId {
  const { keyring } = useCanvas();

  const validate = useCallback(
    value => {
      if (!value || !keyring?.getAccount(value)) {
        return { isValid: false, message: 'Specified account does not exist' };
      }

      return { isValid: true, message: null };
    },
    [keyring?.accounts]
  );

  return useFormField<AccountId>(
    initialValue || keyring?.getAccounts()[0].address || null,
    validate
  );
}

import { useCallback } from 'react';
import { useFormField } from './useFormField';
import type { UseFormField, Validation } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';

export function useAccountId (initialValue: string | null = null): UseFormField<string | null> {
  const { keyring } = useCanvas();

  const validate = useCallback(
    (value): Validation => {
      if (!value || !keyring?.getAccount(value)) {
        return { isValid: false, validation: 'Specified account does not exist' }
      }

      return { isValid: true, validation: null };
    },
    [keyring?.accounts]
  )

  return useFormField<string | null>(
    initialValue || keyring?.getAccounts()[0].address || null,
    validate
  );
}

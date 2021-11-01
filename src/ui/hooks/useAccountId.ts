// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useFormField } from './useFormField';
import { useApi } from 'ui/contexts/ApiContext';
import type { UseFormField, Validation } from 'types';

export function useAccountId(initialValue: string | null = null): UseFormField<string | null> {
  const { keyring } = useApi();

  const validate = useCallback(
    (value): Validation => {
      if (!value || !keyring?.getAccount(value)) {
        return { isValid: false, validation: 'Specified account does not exist' };
      }

      return { isValid: true, validation: null };
    },
    [keyring?.accounts]
  );

  return useFormField<string | null>(
    initialValue || keyring?.getAccounts()[0].address || null,
    validate
  );
}

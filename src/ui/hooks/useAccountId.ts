// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useFormField } from './useFormField';
import { useApi } from 'ui/contexts/ApiContext';
import type { OrFalsy, UseFormField, Validation } from 'types';

export function useAccountId(initialValue: string | null = null): UseFormField<string | null> {
  const { keyring } = useApi();

  const validate = useCallback(
    (value: OrFalsy<string>): Validation => {
      if (!value || !keyring?.getAccount(value)) {
        return { isValid: false, message: 'Specified account does not exist' };
      }

      return { isValid: true, message: null };
    },
    [keyring?.accounts]
  );

  return useFormField<string | null>(
    initialValue || keyring?.getAccounts()[0].address || null,
    validate
  );
}

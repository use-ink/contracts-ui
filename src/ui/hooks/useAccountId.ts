// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useFormField } from './useFormField';
import { useApi } from 'ui/contexts/ApiContext';
import type { OrFalsy, ValidFormField, Validation } from 'types';

export function useAccountId(initialValue = '', isOwned = false): ValidFormField<string> {
  const { keyring } = useApi();

  const validate = useCallback(
    (value: OrFalsy<string>): Validation => {
      if (!value?.trim() || (isOwned && !keyring?.getAccount(value))) {
        return { isValid: false, message: 'Specified account does not exist' };
      }

      return { isValid: true, message: null };
    },
    [keyring, isOwned]
  );

  return useFormField<string>(initialValue || keyring?.getAccounts()[0].address || '', validate);
}

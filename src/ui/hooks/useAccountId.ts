// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { useFormField } from './useFormField';
import { useApi } from 'ui/contexts/ApiContext';
import type { OrFalsy, ValidFormField, Validation } from 'types';

export function useAccountId(
  initialValue: string | undefined = undefined,
  isOwned = false
): ValidFormField<string> {
  const { accounts } = useApi();

  const validate = useCallback(
    (value: OrFalsy<string>): Validation => {
      if (!value?.trim() || (isOwned && accounts?.find(a => a.address === value))) {
        return { isValid: false, message: 'Specified account does not exist' };
      }

      return { isValid: true, message: null };
    },
    [accounts, isOwned]
  );

  const initial = initialValue
    ? initialValue
    : accounts && accounts.length > 0
    ? accounts[0].address
    : '';

  return useFormField<string>(initial, validate);
}

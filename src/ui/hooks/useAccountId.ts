// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormField } from './useFormField';
import { useApi } from 'ui/contexts/ApiContext';
import type { OrFalsy, ValidFormField, Validation } from 'types';

export function useAccountId(initialValue = '', isOwned = false): ValidFormField<string> {
  const { t } = useTranslation();
  const { keyring } = useApi();

  const validate = useCallback(
    (value: OrFalsy<string>): Validation => {
      if (!value?.trim() || (isOwned && !keyring?.getAccount(value))) {
        return { isValid: false, message: t('accountDoesNotExist', 'Specified account does not exist') };
      }

      return { isValid: true, message: null };
    },
    [t, keyring, isOwned]
  );

  return useFormField<string>(initialValue || keyring?.getAccounts()[0].address || '', validate);
}

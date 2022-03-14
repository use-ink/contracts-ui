// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';
import { BN_ZERO, bnToBn } from '@polkadot/util';
import { useTranslation } from 'react-i18next';
import { useFormField } from './useFormField';
import type { BN, ValidFormField, Validation } from 'types';

export function useNonZeroBn(initialValue: BN | number = BN_ZERO): ValidFormField<BN> {
  const { t } = useTranslation();
  const value = useMemo(() => bnToBn(initialValue), [initialValue]);

  const isValid = useCallback(
    (value?: BN | null): Validation => {
    
      if (!value || value?.isZero()) {
        return { isValid: false, message: t('valueCannotBeZero', 'Value cannot be zero') };
      }
    
      return { isValid: true };
    },
    [t]
  )

  return useFormField(value, isValid);
}

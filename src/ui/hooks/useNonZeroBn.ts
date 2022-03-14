import { useMemo } from 'react';
import { BN_ZERO, bnToBn } from '@polkadot/util';
import { useFormField } from './useFormField';
import type { BN, ValidFormField, Validation } from 'types';

function isValid(value?: BN | null): Validation {
  if (!value || value?.isZero()) {
    return { isValid: false, message: 'Value cannot be zero' };
  }

  return { isValid: true };
}

export function useNonZeroBn(initialValue: BN | number = BN_ZERO): ValidFormField<BN> {
  const value = useMemo(() => bnToBn(initialValue), [initialValue]);

  return useFormField(value, isValid);
}

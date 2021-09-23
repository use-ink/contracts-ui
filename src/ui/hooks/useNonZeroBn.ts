import type BN from 'bn.js';

import { useMemo } from 'react';

import { BN_ZERO, bnToBn } from '@polkadot/util';

import { UseFormField, useFormField, Validation } from './useFormField';

function isValid (value?: BN | null): Validation {
  if (!value || value?.isZero()) {
    return { isValid: false , validation: 'Value cannot be zero' };
  }

  return { isValid: true };
}

export function useNonZeroBn (initialValue: BN | number = BN_ZERO): UseFormField<BN> {
  const value = useMemo(() => bnToBn(initialValue), [initialValue]);

  return useFormField(value, isValid);
}

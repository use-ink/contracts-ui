import type BN from 'bn.js';

import { useMemo } from 'react';

import { BN_ZERO, bnToBn } from '@polkadot/util';

import { FormField, useFormField } from './useFormField';

function isValid (value: BN): boolean {
  return !value.isZero();
}

export function useNonZeroBn (initialValue: BN | number = BN_ZERO): FormField<BN> {
  const value = useMemo(() => bnToBn(initialValue), [initialValue]);

  return useFormField(value, isValid);
}

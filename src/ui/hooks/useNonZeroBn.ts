import { useMemo } from 'react';
import { BN_ZERO, bnToBn } from '@polkadot/util';
import { useFormField } from './useFormField';
import type { BN, OrFalsy, UseFormField } from 'types';

type Value = OrFalsy<BN>;

function isValid(value?: Value) {
  if (!value || value?.isZero()) {
    return { isValid: false, message: 'Value cannot be zero' };
  }

  return { isValid: true };
}

export function useNonZeroBn(initialValue: Value = BN_ZERO): UseFormField<Value> {
  const value = useMemo(() => bnToBn(initialValue), [initialValue]);

  return useFormField<Value>(value, isValid);
}

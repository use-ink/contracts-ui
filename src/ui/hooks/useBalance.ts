import { BN_ONE, BN_TWO, BN_ZERO, isBn } from '@polkadot/util';
import BN from 'bn.js';
import React from 'react';
import { useFormField } from './useFormField';
import type { UseBalance, Validation } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';
import { toBalance, toSats } from 'canvas/util';

type BitLength = 8 | 16 | 32 | 64 | 128 | 256;

const DEFAULT_BITLENGTH = 128;

interface ValidateOptions {
  bitLength?: BitLength;
  isZeroable?: boolean;
  maxValue?: BN;
}

function getGlobalMaxValue(bitLength?: number): BN {
  return BN_TWO.pow(new BN(bitLength || DEFAULT_BITLENGTH)).isub(BN_ONE);
}

function validate(
  value: BN | null | undefined,
  { bitLength = DEFAULT_BITLENGTH, isZeroable, maxValue }: ValidateOptions
): Validation {
  let message: React.ReactNode;
  let isValid = true;

  if (!value) {
    isValid = false;
    return {
      isValid,
    };
  }

  if (value?.lt(BN_ZERO)) {
    message = 'Value cannot be negative';
  }

  if (value?.gt(getGlobalMaxValue(bitLength))) {
    message = 'Value exceeds global maximum';
  }

  if (!isZeroable && value?.isZero()) {
    message = 'Value cannot be zero';
  }

  if (value && value?.bitLength() > (bitLength || DEFAULT_BITLENGTH)) {
    message = "Value's bitlength is too high";
  }

  if (maxValue && maxValue.gtn(0) && value?.gt(maxValue)) {
    message = `Value cannot exceed ${maxValue?.toNumber()}`;
  }

  return {
    isValid: !message,
    message,
  };
}

export function useBalance(
  initialValue: BN | string | number = 0,
  isZeroable = false,
  maxValue?: BN
): UseBalance {
  const { api } = useCanvas();
  const balance = useFormField<BN | null | undefined>(
    isBn(initialValue) ? toSats(api, initialValue) : toBalance(api, initialValue),
    value => validate(value, { isZeroable, maxValue })
  );

  return balance;
}

// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ONE, BN_TWO, BN_ZERO, isBn } from '@polkadot/util';
import BN from 'bn.js';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormField } from './useFormField';
import { toBalance, toSats } from 'api/util';
import { useApi } from 'ui/contexts/ApiContext';
import type { UseBalance, Validation } from 'types';

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

export function useBalance(
  initialValue: BN | string | number = 0,
  isZeroable = false,
  maxValue?: BN
): UseBalance {
  const { t } = useTranslation();
  const { api } = useApi();

  const validate = useCallback(
    (
      value: BN | null | undefined,
      { bitLength = DEFAULT_BITLENGTH, isZeroable, maxValue }: ValidateOptions
    ): Validation => {
      let message: React.ReactNode;
      let isError = false;

      if (!value) {
        isError = true;
        return {
          isError,
        };
      }

      if (value?.lt(BN_ZERO)) {
        isError = true;
        message = t('balanceNegative', 'Value cannot be negative');
      }

      if (value?.gt(getGlobalMaxValue(bitLength))) {
        isError = true;
        message = t('balanceGlobalMaximum', 'Value exceeds global maximum');
      }

      if (!isZeroable && value?.isZero()) {
        isError = true;
        message = t('balanceNonZero', 'Value cannot be zero');
      }

      if (value && value?.bitLength() > (bitLength || DEFAULT_BITLENGTH)) {
        isError = true;
        message = t('balanceBitlength', 'Value\'s bitlength is too high');
      }

      if (maxValue && maxValue.gtn(0) && value?.gt(maxValue)) {
        isError = true;
        message = t('balanceMaximum', 'Value cannot exceed {{maxValue}}', { replace: { maxValue: maxValue.toNumber() } });
      }

      return {
        isError,
        isValid: !isError,
        message,
      };
    },
    [t]
  );

  const balance = useFormField<BN>(
    isBn(initialValue) ? toSats(api, initialValue) : toBalance(api, initialValue),
    value => validate(value, { isZeroable, maxValue })
  );

  return balance;
}

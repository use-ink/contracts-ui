// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Big from 'big.js';
import React, { useMemo } from 'react';
import { isNumber } from '@polkadot/util';
import { Meter } from '../common';
import { InputBalance } from './InputBalance';
import { getValidation } from './FormField';
import type { SimpleSpread } from 'types';
import { classes } from 'ui/util';
import type { UseStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';

type Props = SimpleSpread<React.HTMLAttributes<HTMLDivElement>, UseStorageDepositLimit>;

export function InputStorageDepositLimit({ className, maximum, onChange, value, ...props }: Props) {
  const percentage = useMemo((): number | null => {
    if (!maximum) {
      return null;
    }
    return 100 * new Big(value.toString()).div(new Big(maximum.toString())).toNumber();
  }, [maximum, value]);

  return (
    <div className={classes(className)} {...props}>
      <InputBalance value={value} onChange={onChange} {...getValidation(props)} />
      <Meter
        label={isNumber(percentage) ? `${percentage.toFixed(2)}% of free balance` : null}
        percentage={isNumber(percentage) ? percentage : 100}
      />
    </div>
  );
}

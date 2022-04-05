// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Big from 'big.js';
import { useMemo } from 'react';
import { isNull, isNumber } from '@polkadot/util';
import { Meter, Switch } from '../common';
import { InputBalance } from './InputBalance';
import { getValidation } from './FormField';
import type { SimpleSpread } from 'types';
import { classes } from 'ui/util';
import type { UseStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  UseStorageDepositLimit & {
    isActive?: boolean;
    toggleIsActive: () => void;
  }
>;

export function InputStorageDepositLimit({
  className,
  isActive = false,
  maximum,
  onChange,
  toggleIsActive,
  value,
  ...props
}: Props) {
  const percentage = useMemo((): number | null => {
    if (!maximum || maximum.eqn(0)) {
      return null;
    }
    return 100 * new Big(value.toString()).div(new Big(maximum.toString())).toNumber();
  }, [maximum, value]);

  return (
    <div className={classes(className)}>
      <div className="flex items-center">
        <InputBalance
          className="flex-1"
          value={isActive ? value : undefined}
          id="storageDepositLimit"
          isDisabled={!isActive}
          onChange={onChange}
          placeholder={isActive ? undefined : 'Do not use'}
          withUnits={isActive}
          {...getValidation(props)}
        />
        <div className="flex justify-center items-center w-18">
          <Switch value={isActive} onChange={toggleIsActive} />
        </div>
      </div>
      {isActive && !isNull(percentage) && (
        <Meter
          label={isNumber(percentage) ? `${percentage.toFixed(2)}% of free balance` : null}
          percentage={isNumber(percentage) ? percentage : 100}
        />
      )}
    </div>
  );
}

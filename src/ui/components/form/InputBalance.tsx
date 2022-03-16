// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback, useState } from 'react';
import BN from 'bn.js';
import { BN_ZERO } from '@polkadot/util';
import { Input } from './Input';
import { fromBalance, fromSats, toBalance } from 'api/util';
import { ApiPromise, OrFalsy, SimpleSpread } from 'types';
import { useApi } from 'ui/contexts';
import { classes } from 'ui/util';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    isDisabled?: boolean;
    value: OrFalsy<BN>;
    onChange: (_: BN) => void;
    withUnits?: boolean;
  }
>;

function getStringValue(api: ApiPromise, value: OrFalsy<BN>) {
  if (!value) {
    return '';
  }

  return fromBalance(fromSats(api, value || BN_ZERO));
}

function InputBalanceBase({
  children,
  className,
  isDisabled,
  placeholder,
  value,
  onChange: _onChange,
  withUnits = true,
}: Props) {
  const { api, tokenSymbol } = useApi();

  const [stringValue, setStringValue] = useState(getStringValue(api, value));

  const onChange = useCallback(
    (value: string): void => {
      setStringValue(value);

      const bn = toBalance(api, value);

      _onChange(bn);
    },
    [_onChange, api]
  );

  return (
    <>
      <div className={classes('relative rounded-md shadow-sm', className)}>
        <Input
          isDisabled={isDisabled}
          onChange={onChange}
          onFocus={e => e.target.select()}
          placeholder={placeholder}
          pattern="^\d*\.?\d*?$"
          value={stringValue}
        >
          {withUnits && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <span className="text-gray-500 sm:text-sm mr-7">{tokenSymbol}</span>
              {/* <label htmlFor="unit" className="sr-only">
                Unit
              </label>
              <select
                disabled
                id="unit"
                name="unit"
                className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
              >
                <option value={tokenSymbol}>{tokenSymbol}</option>
              </select> */}
            </div>
          )}
          {children}
        </Input>
      </div>
    </>
  );
}

export const InputBalance = React.memo(InputBalanceBase);

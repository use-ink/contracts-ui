// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { useCallback } from 'react';
import { BN_ZERO } from '@polkadot/util';
import { Input } from './Input';
import { SimpleSpread } from 'types';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    isDisabled?: boolean;
    value?: BN;
    onChange: (_: BN) => void;
  }
>;

export function InputNumber({
  children,
  isDisabled,
  onChange: _onChange,
  value = BN_ZERO,
  ...props
}: Props) {
  const onChange = useCallback(
    (value: string) => {
      _onChange(new BN(value));
    },
    [_onChange]
  );

  return (
    <Input
      isDisabled={isDisabled}
      onChange={onChange}
      onFocus={e => e.target.select()}
      type="number"
      value={value ? value.toString() : ''}
      {...props}
    >
      {children}
    </Input>
  );
}

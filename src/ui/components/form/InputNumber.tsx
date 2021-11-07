// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback } from 'react';
import { BN_ZERO } from '@polkadot/util';
import { Input } from './Input';
import { SimpleSpread } from 'types';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: BN;
    onChange: (_: BN) => void;
  }
>;

export function InputNumber({ children, onChange: _onChange, value = BN_ZERO }: Props) {
  const onChange = useCallback(
    (value: string) => {
      _onChange(new BN(value));
    },
    [_onChange]
  );

  return (
    <Input
      onChange={onChange}
      onFocus={e => e.target.select()}
      type="number"
      value={value ? value.toString() : ''}
    >
      {children}
    </Input>
  );
}

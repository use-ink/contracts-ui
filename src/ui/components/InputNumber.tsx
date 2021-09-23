import BN from 'bn.js';
import React, { useCallback } from 'react';
import { Input } from './Input';
import { SimpleSpread } from 'types';
import { BN_ZERO } from '@polkadot/util';

type Props =  SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: BN;
    onChange: (_: BN) => void;
  }
>;

export function InputNumber ({ children, onChange: _onChange, value = BN_ZERO, ...props }: Props) {
  const onChange = useCallback(
    (value: string) => {
      _onChange(new BN(value));
    },
    []
  );

  return (
    <Input
      onChange={onChange}
      type="number"
      value={value.toString()}
      {...props}
    >
      {children}
    </Input>
  );
}
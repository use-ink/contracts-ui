// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { useCallback, useState } from 'react';
import { BN_ZERO } from '@polkadot/util';
import { Input } from './Input';
import { OrFalsy, SimpleSpread } from 'types';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    isDisabled?: boolean;
    value: OrFalsy<BN>;
    onChange: (_: OrFalsy<BN>) => void;
  }
>;

export function InputNumber({
  children,
  isDisabled,
  onChange: _onChange,
  value = BN_ZERO,
  ...props
}: Props) {
  const [asString, setAsString] = useState(value?.toString() || '');

  const onChange = useCallback(
    (value: string) => {
      setAsString(value);

      if (!/^(0|-?[1-9]\d*)$/.test(value)) {
        _onChange(null);
        return;
      }

      try {
        _onChange(new BN(value));
      } catch (e) {
        console.error(e);
      }
    },
    [_onChange]
  );

  return (
    <Input
      isDisabled={isDisabled}
      onChange={onChange}
      onFocus={e => e.target.select()}
      value={asString}
      {...props}
    >
      {children}
    </Input>
  );
}

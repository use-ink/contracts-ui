// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback, useState } from 'react';
import { Input } from './Input';
import { ArgComponentProps } from 'types';
import { classes } from 'helpers';

type Props = ArgComponentProps<string>;

export function InputBytes({ onChange, className }: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState('');
  const handleChange = useCallback(
    (d: string) => {
      const regex = /^(0x|0X)?[a-fA-F0-9]+$/;
      if (!d || regex.test(d)) {
        setDisplayValue(d);
        onChange(d);
      }
    },
    [onChange]
  );

  return (
    <div className="flex items-center relative w-full">
      <span className="text-gray-400 absolute text-sm left-2">0x</span>
      <Input
        className={classes('pl-7 flex-1', className)}
        value={displayValue}
        onChange={handleChange}
        placeholder="hexadecimal representation of Bytes"
        type="text"
      />
    </div>
  );
}

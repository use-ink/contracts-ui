// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { Input } from './Input';
import { classes } from 'helpers';

interface Props {
  onChange: (_: string) => void;
  className?: string;
  defaultValue?: string;
  error?: string;
}

export function InputHex({ onChange, className, defaultValue, error }: Props) {
  const [value, setValue] = useState(defaultValue ?? '');

  const handleChange = useCallback(
    (d: string) => {
      const regex = /^(0x|0X)?[a-fA-F0-9]+$/;
      if (!d || regex.test(d)) {
        setValue(d);
        onChange(d);
      }
    },
    [onChange]
  );
  return (
    <>
      <div className="flex items-center relative w-full">
        <span className="text-gray-400 absolute text-sm left-3">0x</span>
        <Input
          className={classes('pl-8 flex-1', className)}
          value={value}
          onChange={handleChange}
          placeholder="hexadecimal text"
          type="text"
        />
      </div>
      <div className="text-xs text-red-600 basis-full mt-1">{error}</div>
    </>
  );
}

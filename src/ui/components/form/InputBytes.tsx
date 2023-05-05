// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback, useState } from 'react';
import { hexToU8a, compactAddLength } from '@polkadot/util';
import { Input } from './Input';
import { ArgComponentProps } from 'types';
import { classes } from 'helpers';

type Props = ArgComponentProps<Uint8Array>;

export function InputBytes({ onChange, className }: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState('0000');
  const handleChange = useCallback(
    (d: string) => {
      const regex = /^(0x|0X)?[a-fA-F0-9]+$/;
      if (!d || regex.test(d)) {
        setDisplayValue(d);
        try {
          const raw = hexToU8a(`0x${d}`);
          onChange(compactAddLength(raw));
        } catch (e) {
          console.error(e);
        }
      }
    },
    [onChange]
  );

  return (
    <>
      <div className="relative flex w-full items-center">
        <span className="absolute left-3 text-sm text-gray-400">0x</span>
        <Input
          className={classes('flex-1 pl-8', className)}
          value={displayValue}
          onChange={handleChange}
          placeholder="hexadecimal representation of Bytes"
          type="text"
        />
      </div>
      <div className="mt-1 basis-full text-xs text-red-600">
        {displayValue.length % 2 !== 0 &&
          'A trailing zero will be added. Please input an even number of bytes.'}
      </div>
    </>
  );
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ArgComponentProps } from 'types';

import React, { useCallback, useState } from 'react';
import { Input } from './Input';

type Props = ArgComponentProps<string>;

export function InputBytes({ onChange, className }: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState('0x00');
  const handleChage = useCallback(
    (d: string) => {
      const isValid = d.startsWith('0x') && d.length > 2;
      setDisplayValue(d);
      isValid && onChange(d);
    },
    [onChange]
  );

  return (
    <Input
      className={className}
      value={displayValue}
      onChange={handleChage}
      placeholder="0x prefixed hex, e.g. 0x1234"
      type="text"
    />
  );
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback, useState } from 'react';
import { hexToU8a, compactAddLength } from '@polkadot/util';
import { InputHex } from './InputHex';
import { ArgComponentProps } from 'types';

type Props = ArgComponentProps<Uint8Array>;

type Validation = { isValid: boolean; message?: string };

function validate(value: string): Validation {
  if (value.length % 2 !== 0) {
    return {
      isValid: false,
      message: 'A trailing zero will be added. Please input an even number of bytes.',
    };
  }
  return {
    isValid: true,
    message: '',
  };
}

export function InputBytes({
  onChange,
  className,
  defaultValue,
}: Props): React.ReactElement<Props> {
  const [{ isValid, message }, setValidation] = useState<Validation>({ isValid: true });

  const handleChange = useCallback(
    (d: string) => {
      const validation = validate(d);
      setValidation(validation);
      try {
        const raw = hexToU8a(`0x${d}`);
        onChange(compactAddLength(raw));
      } catch (e) {
        console.error(e);
      }
    },
    [onChange]
  );

  return (
    <InputHex
      defaultValue={defaultValue?.toString()}
      onChange={handleChange}
      className={className}
      error={!isValid ? message : undefined}
    />
  );
}

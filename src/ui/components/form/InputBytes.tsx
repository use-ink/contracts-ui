// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { hexToU8a } from '@polkadot/util';
import React, { useCallback, useMemo, useState } from 'react';
import { InputHex } from './InputHex';
import { ArgComponentProps } from 'types';

type Props = ArgComponentProps<Uint8Array> & { length?: number };
type Validation = { isValid: boolean; message?: string };

const validateFn =
  (length = 64) =>
  (value: string): Validation => {
    if (value.length < length) {
      return { isValid: false, message: `Input too short! Expecting ${length} characters.` };
    }
    if (value.length > length) {
      return { isValid: false, message: `Input too long! Expecting ${length} characters.` };
    }
    return {
      isValid: true,
      message: '',
    };
  };

export function InputBytes({
  onChange,
  className,
  defaultValue,
  length,
}: Props): React.ReactElement<Props> {
  const [{ isValid, message }, setValidation] = useState<Validation>({ isValid: true });
  const validate = useMemo(() => validateFn(length), [length]);

  const handleChange = useCallback(
    (d: string) => {
      const validation = validate(d);
      setValidation(validation);
      try {
        onChange(hexToU8a(`0x${d}`));
      } catch (e) {
        console.error(e);
      }
    },
    [onChange, validate]
  );

  return (
    <InputHex
      className={className}
      defaultValue={defaultValue?.toString()}
      error={!isValid ? message : undefined}
      onChange={handleChange}
    />
  );
}

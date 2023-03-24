// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { InputHex } from './InputHex';
import { ArgComponentProps, Hash } from 'types';

type Props = ArgComponentProps<Hash>;

export function InputHash({ registry, onChange, className }: Props) {
  const handleChange = useCallback(
    (d: string) => {
      try {
        const x = registry.createType('Hash', `0x${d}`);
        onChange(x);
      } catch (e) {
        console.error(e);
      }
    },
    [onChange, registry]
  );
  return <InputHex onChange={handleChange} className={className} />;
}

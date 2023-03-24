// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback } from 'react';
import { hexToU8a, compactAddLength } from '@polkadot/util';
import { InputHex } from './InputHex';
import { ArgComponentProps } from 'types';

type Props = ArgComponentProps<Uint8Array>;

export function InputBytes({ onChange, className }: Props): React.ReactElement<Props> {
  const handleChange = useCallback(
    (d: string) => {
      try {
        const raw = hexToU8a(`0x${d}`);
        onChange(compactAddLength(raw));
      } catch (e) {
        console.error(e);
      }
    },
    [onChange]
  );

  return <InputHex defaultValue="0000" onChange={handleChange} className={className} />;
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import BN from 'bn.js';
import { InputNumber } from './InputNumber';
import { ArgComponentProps } from 'types';

type Props = ArgComponentProps<BN>;

export function InputBn({ onChange, typeDef }: Props): JSX.Element {
  const [displayValue, setDisplayValue] = useState('0');

  const handleChage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.trim()) {
        const bn = new BN(e.target.value);
        setDisplayValue(e.target.value);
        onChange(bn);
      }
    },
    [onChange]
  );

  const min = typeDef && typeDef.type.startsWith('u') ? '0' : undefined;
  return (
    <>
      <InputNumber
        value={displayValue}
        onChange={handleChage}
        placeholder="Input a number"
        data-cy="gas-input"
        min={min}
      />
    </>
  );
}

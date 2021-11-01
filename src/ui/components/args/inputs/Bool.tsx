// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { SimpleSpread } from 'types';
import { Dropdown } from 'ui/components/Dropdown';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  {
    value: boolean;
    onChange: (_: boolean) => void;
  }
>;

const options = [
  {
    value: false,
    name: 'false',
  },
  {
    value: true,
    name: 'true',
  },
];

export function Bool({ value, onChange, ...props }: Props) {
  return <Dropdown {...props} onChange={onChange} options={options} value={value} />;
}

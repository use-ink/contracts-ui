// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleSpread, ValidFormField } from 'types';
import { Dropdown } from 'ui/components/common/Dropdown';

type Props = SimpleSpread<React.HTMLAttributes<HTMLDivElement>, ValidFormField<boolean>>;

const options = [
  {
    value: false,
    label: 'false',
  },
  {
    value: true,
    label: 'true',
  },
];

export function Bool({ value, onChange, ...props }: Props) {
  const { t } = useTranslation();

  return <Dropdown {...props} onChange={onChange} options={options.map((option) => ({ ...option, label: t(option.label, option.label) }))} value={value} />;
}

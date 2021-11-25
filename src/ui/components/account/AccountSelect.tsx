// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Dropdown } from '../common/Dropdown';
import { Account } from './Account';
import { createAccountOptions } from 'api/util';
import type { DropdownProps, OptionProps, UseFormField } from 'types';
import { useApi } from 'ui/contexts';

type Props = UseFormField<string> & Omit<DropdownProps<string>, 'options'>;

function Option({ option: { name, value } }: OptionProps<string>) {
  return <Account name={name} value={value} />;
}

export function AccountSelect({
  isDisabled,
  isError,
  value,
  onChange,
  children: placeholder = 'No Accounts Found',
  className,
}: Props) {
  const { keyring } = useApi();
  const options = createAccountOptions(keyring.getPairs());

  return (
    <Dropdown
      button={Option}
      className={className}
      isDisabled={isDisabled}
      isError={isError}
      option={Option}
      onChange={onChange}
      options={options}
      value={value}
    >
      {placeholder}
    </Dropdown>
  );
}

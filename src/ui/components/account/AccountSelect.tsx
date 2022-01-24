// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Dropdown } from '../common/Dropdown';
import { Account } from './Account';
import { createAccountOptions } from 'api/util';
import type { DropdownOption, DropdownProps, OrFalsy, ValidFormField } from 'types';
import { useApi } from 'ui/contexts';
import { classes } from 'ui/util';

type Props = ValidFormField<OrFalsy<string>> & Omit<DropdownProps<string>, 'options'>;

function Option({ label, value }: DropdownOption<string>) {
  return <Account name={label} value={value} />;
}

export function AccountSelect({
  isDisabled,
  onChange,
  placeholder = 'No Accounts Found',
  className,
  value,
}: Props) {
  const { keyring } = useApi();
  const options = createAccountOptions(keyring.getPairs());

  return (
    <Dropdown
      className={classes('account-select', className)}
      isDisabled={isDisabled}
      formatOptionLabel={Option}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isSearchable
      value={value}
    />
  );
}

// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo } from 'react';
import { GroupBase } from 'react-select';
import { Dropdown } from '../common/Dropdown';
import { Account } from './Account';
import { createAccountOptions } from 'ui/util/dropdown';
import type { DropdownOption, DropdownProps, OrFalsy, ValidFormField } from 'types';
import { useApi, useDatabase } from 'ui/contexts';
import { classes } from 'ui/util';
import { useDbQuery } from 'ui/hooks';

type Props = ValidFormField<OrFalsy<string>> & Omit<DropdownProps<string>, 'options'>;

function Option({ label, value }: DropdownOption<string>) {
  return <Account className="p-1.5" name={label} value={value} />;
}

function Select({
  isDisabled,
  onChange,
  options,
  placeholder = 'Select account',
  className,
  value,
}: DropdownProps<string>) {
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

export function AccountSelect({ placeholder = 'Select account', ...props }: Props) {
  const { keyring } = useApi();

  return (
    <Select
      options={createAccountOptions(keyring?.getPairs())}
      placeholder={placeholder}
      {...props}
    />
  );
}

export function AddressSelect({ placeholder = 'Select account', ...props }: Props) {
  const { keyring } = useApi();
  const { db } = useDatabase();
  const [contracts] = useDbQuery(() => db.contracts.toArray(), [db]);

  const options = useMemo((): GroupBase<DropdownOption<string>>[] => {
    return [
      {
        label: 'My Accounts',
        options: createAccountOptions(keyring?.getPairs()),
      },
      ...(contracts && contracts.length > 0
        ? [
            {
              label: 'Uploaded Contracts',
              options: (contracts || []).map(({ name, address }) => ({
                label: name,
                value: address,
              })),
            },
          ]
        : []),
    ];
  }, [keyring, contracts]);

  return <Select options={options} placeholder={placeholder} {...props} />;
}

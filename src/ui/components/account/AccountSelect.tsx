// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { GroupBase } from 'react-select';
import { Dropdown } from '../common/Dropdown';
import { Account } from './Account';
import { createAccountOptions } from 'ui/util/dropdown';
import type { DropdownOption, DropdownProps, OrFalsy, ValidFormField } from 'types';
import { useApi, useDatabase } from 'ui/contexts';
import { classes } from 'ui/util';

type Props = ValidFormField<OrFalsy<string>> & Omit<DropdownProps<string>, 'options'>;

function isContractExistent<T>(value: T | undefined | { identifier: string }): value is T {
  return !!value && (value as Record<string, unknown>).identifier === undefined;
}

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
  const { myContracts } = useDatabase();
  const options = useMemo((): GroupBase<DropdownOption<string>>[] => {
    return [
      {
        label: 'My Accounts',
        options: createAccountOptions(keyring?.getPairs()),
      },
      ...(myContracts?.owned && myContracts.owned.length > 0
        ? [
            {
              label: 'Uploaded Contracts',
              options: (myContracts?.owned || []).map(({ name, address }) => ({
                label: name,
                value: address,
              })),
            },
          ]
        : []),
      ...(myContracts?.starred && myContracts.starred.length > 0
        ? [
            {
              label: 'Starred Contracts',
              options: (myContracts?.starred || []).reduce(
                (result: DropdownOption<string>[], starredContract) => {
                  return [
                    ...result,
                    ...(isContractExistent(starredContract.value)
                      ? [{ label: starredContract.value.name, value: starredContract.value.name }]
                      : []),
                  ];
                },
                []
              ),
            },
          ]
        : []),
    ];
  }, [keyring, myContracts?.owned, myContracts?.starred]);

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

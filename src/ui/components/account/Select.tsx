// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { GroupBase } from 'react-select';
import { useTranslation } from 'react-i18next';
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

function Select({
  isDisabled,
  onChange,
  options,
  placeholder,
  className,
  value,
}: DropdownProps<string>) {
  const { t } = useTranslation();

  return (
    <Dropdown
      className={classes('account-select', className)}
      isDisabled={isDisabled}
      formatOptionLabel={Option}
      onChange={onChange}
      options={options}
      placeholder={placeholder || t('noAddressesFound', 'No Addresses Found')}
      isSearchable
      value={value}
    />
  );
}

export function AccountSelect({
  placeholder,
  ...props
}: Props) {
  const { t } = useTranslation();
  const { keyring } = useApi();

  return (
    <Select
      options={createAccountOptions(keyring?.getPairs())}
      placeholder={placeholder || t('noAccountsFound', 'No Accounts Found')}
      {...props}
    />
  )
}

export function AddressSelect({
  placeholder,
  ...props
}: Props) {
  const { t } = useTranslation();
  const { keyring } = useApi();
  const { myContracts } = useDatabase();

  const options = useMemo((): GroupBase<DropdownOption<string>>[] => {
    return [
      {
        label: t('myAccounts', 'My Accounts'),
        options: createAccountOptions(keyring?.getPairs()),
      },
      ...(myContracts?.owned && myContracts.owned.length > 0
        ? [
            {
              label: t('uploadedContracts', 'Uploaded Contracts'),
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
              label: t('starredContracts', 'Starred Contracts'),
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
  }, [t, keyring, myContracts?.owned, myContracts?.starred]);

  return (
    <Select
      options={options}
      placeholder={placeholder || t('noAddressesFound', 'No Addresses Found')}
      {...props}
    />
  );
}

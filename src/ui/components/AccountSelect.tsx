import React from 'react';
import { Dropdown } from './Dropdown';
import { Account } from './Account';
import type { DropdownProps, OptionProps, UseFormField } from 'types';
import { createAccountOptions } from 'canvas/util';
import { useCanvas } from 'ui/contexts';

type Props = UseFormField<string | null> & Omit<DropdownProps<string | null>, 'options'>;

function Option ({ option: { name, value } }: OptionProps<string | null>) {
  return (
    <Account name={name} value={value} />
  )
}

export function AccountSelect ({
  isDisabled,
  isError,
  value,
  onChange,
  children: placeholder = 'No Accounts Found',
  className,
}: Props) {
  const { keyring } = useCanvas();
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
  )
};

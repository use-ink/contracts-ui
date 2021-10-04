import React, { useMemo } from 'react';
import { Dropdown } from './Dropdown';
import { Account } from './Account';
import type { DropdownOption, DropdownProps, OrNull, UseFormField } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';

type Props = UseFormField<OrNull<string>> & Omit<DropdownProps<OrNull<string>>, 'options'>;

function useAccountOptions(): DropdownOption<string>[] {
  const { keyring } = useCanvas();

  return useMemo(
    () =>
      (keyring?.getAccounts() || []).map(account => ({
        name: <Account value={account.address} />,
        value: account.address,
      })),
    [keyring]
  );
}

export function AccountSelect(props: Props) {
  const options = useAccountOptions();

  return <Dropdown options={options} {...props} />;
}

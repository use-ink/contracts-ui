import React from 'react';
import { DropdownOption, KeyringPair } from '../../types';
import { Dropdown } from './Dropdown';
import { createOptions } from 'canvas/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  options?: DropdownOption[];
  selectedOption?: DropdownOption;
  placeholder?: string;
  changeHandler: (o: DropdownOption) => void;
  withValueShown?: boolean;
  keyringPairs?: Partial<KeyringPair>[];
}

export const AccountSelector = ({
  selectedOption,
  changeHandler,
  keyringPairs,
  placeholder = 'No Account Found',
}: Props) => {
  return (
    <>
      <label
        htmlFor="selectAccount"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Account
      </label>

      <Dropdown
        options={createOptions(keyringPairs, 'pair')}
        placeholder={placeholder}
        className="mb-4"
        selectedOption={selectedOption}
        withValueShown={true}
        changeHandler={changeHandler}
      />
    </>
  );
};

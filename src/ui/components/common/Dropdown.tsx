// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useMemo } from 'react';
import Select, {
  components,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  InputProps,
  OptionProps,
  Props as ReactSelectProps,
} from 'react-select';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { classes } from 'ui/util';
import type { DropdownOption, DropdownProps } from 'types';

function isGroupedOptions<T>(
  options: ReactSelectProps<DropdownOption<T>, false>['options']
): options is GroupBase<DropdownOption<T>>[] {
  try {
    return !!options && (options as GroupBase<DropdownOption<T>>[])[0].options !== undefined;
  } catch (e) {
    return false;
  }
}

function Control<T>(props: ControlProps<DropdownOption<T>, false>) {
  return <components.Control {...props} className={classes(props.className, 'min-h-0')} />;
}

function Input<T>(props: InputProps<DropdownOption<T>, false>) {
  return (
    <components.Input
      {...props}
      inputClassName="dark:text-white outline-none border-none shadow-none focus:ring-transparent"
    />
  );
}

function Option<T>({ children, ...props }: OptionProps<DropdownOption<T>, false>) {
  return (
    <components.Option {...props}>
      <span>{children}</span>
      {props.isSelected && <CheckIcon className="selected" />}
    </components.Option>
  );
}

function DropdownIndicator<T>(props: DropdownIndicatorProps<DropdownOption<T>, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon />
    </components.DropdownIndicator>
  );
}

export function Dropdown<T>({
  className = '',
  components = {},
  formatOptionLabel,
  isDisabled = false,
  isSearchable = false,
  onChange: _onChange,
  options = [],
  placeholder,
  value: _value,
}: DropdownProps<T>) {
  const onChange = useCallback(
    (option: DropdownOption<T> | null): void => {
      option && _onChange(option.value);
    },
    [_onChange]
  );

  const value = useMemo(() => {
    if (isGroupedOptions(options)) {
      return options
        .reduce((result: DropdownOption<T>[], { options }) => [...result, ...options], [])
        .find(({ value }) => value === _value);
    }

    return (options as DropdownOption<T>[]).find(({ value }) => value === _value);
  }, [options, _value]);

  return (
    <Select
      className={classes('dropdown', className)}
      classNamePrefix="dropdown"
      components={{ Control, DropdownIndicator, Input, Option, ...components }}
      formatOptionLabel={formatOptionLabel}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      styles={{
        dropdownIndicator: provided => ({ ...provided, padding: '0.25rem' }),
        input: provided => ({ ...provided, color: 'unset' }),
        option: () => ({}),
      }}
      value={value}
    />
  );
}

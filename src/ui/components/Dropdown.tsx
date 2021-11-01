// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { Fragment, useCallback, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import type { DropdownOption, DropdownProps as Props } from 'types';
import { classes } from 'ui/util';

export function Dropdown<T>({
  button: Button,
  option: Option,
  options = [],
  children: placeholder,
  className = '',
  isDisabled = false,
  isError = false,
  onChange: _onChange,
  value,
}: Props<T>) {
  const selected = useMemo(
    (): DropdownOption<T> => options.find(option => value === option.value) || options[0],
    [options, value]
  );

  const onChange = useCallback(
    (option: DropdownOption<T>) => {
      _onChange(option.value);
    },
    [_onChange]
  );

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className={classes('dropdown', isError ? 'isError' : '', className)}>
          <Listbox.Button
            data-testid="dropdown-btn"
            className={classes('dropdown-btn option', open ? ' rounded-b-none' : '')}
            disabled={isDisabled ? true : undefined}
          >
            {Button ? (
              <Button option={selected} isPlaceholder={options.length === 0} />
            ) : (
              <span>{options.length > 0 ? selected?.name : placeholder}</span>
            )}
            <ChevronDownIcon aria-hidden="true" />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="options">
              {options?.map((option, index) => (
                <Listbox.Option
                  data-testid={`dropdown-option-${index}`}
                  key={index}
                  className={({ active, selected }) =>
                    classes('option', active && 'active', selected && 'selected')
                  }
                  value={option}
                >
                  {({ selected }) => {
                    return Option ? (
                      <Option option={option} isSelected={selected} />
                    ) : (
                      <>
                        <span>{option.name}</span>
                        {selected && <CheckIcon aria-hidden="true" />}
                      </>
                    );
                  }}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}

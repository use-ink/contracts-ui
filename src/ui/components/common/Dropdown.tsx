// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
// import { Listbox, Transition } from '@headlessui/react';
import Select, {
  components,
  DropdownIndicatorProps,
  GroupBase,
  OptionProps,
  Props as ReactSelectProps,
} from 'react-select';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import type { DropdownOption, DropdownProps } from 'types';
import { classes } from 'ui/util';
// import { classes } from 'ui/util';

// const customStyles: StylesConfig = {
//   container: () => ({
//     position: 'relative',

//   }),

//   menu: (provided, state) => ({
//     ...provided,
//     width: state.selectProps.width,
//     borderBottom: '1px dotted pink',
//     color: state.selectProps.menuColor,
//     padding: 20,
//   }),

//   control: () => ({
//     width: width
//   }),

//   singleValue: (provided, state) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return { ...provided, opacity, transition };
//   }
// }

const styles = { option: () => ({}) };

function isGroupedOptions<T>(
  options: ReactSelectProps<DropdownOption<T>, false>['options']
): options is GroupBase<DropdownOption<T>>[] {
  try {
    return !!options && (options as GroupBase<DropdownOption<T>>[])[0].options !== undefined;
  } catch (e) {
    return false;
  }
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
    console.log(options);

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
      components={{ DropdownIndicator, Option }}
      formatOptionLabel={formatOptionLabel}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      styles={styles}
      value={value}
    />
  );

  // return (
  //   <Listbox disabled={isDisabled ? true : undefined} value={selected} onChange={onChange}>
  //     {({ open }) => (
  //       <div className={classes('dropdown', isError ? 'isError' : '', className)}>
  //         <Listbox.Button
  //           data-testid="dropdown-btn"
  //           className={classes('dropdown-btn option', open ? ' rounded-b-none' : '')}
  //         >
  //           {Button ? (
  //             <Button option={selected} isPlaceholder={options.length === 0} />
  //           ) : (
  //             <span>{options.length > 0 ? selected?.name : placeholder}</span>
  //           )}
  //           <ChevronDownIcon aria-hidden="true" />
  //         </Listbox.Button>
  //         <Transition
  //           as={Fragment}
  //           leave="transition ease-in duration-100"
  //           leaveFrom="opacity-100"
  //           leaveTo="opacity-0"
  //         >
  //           <Listbox.Options className="options">
  //             {options?.map((option, index) => (
  //               <Listbox.Option
  //                 data-testid={`dropdown-option-${index}`}
  //                 key={index}
  //                 className={({ active, selected }) =>
  //                   classes('option', active && 'active', selected && 'selected')
  //                 }
  //                 value={option}
  //               >
  //                 {({ selected }) => {
  //                   return Option ? (
  //                     <Option option={option} isSelected={selected} />
  //                   ) : (
  //                     <>
  //                       <span>{option.name}</span>
  //                       {selected && <CheckIcon aria-hidden="true" />}
  //                     </>
  //                   );
  //                 }}
  //               </Listbox.Option>
  //             ))}
  //           </Listbox.Options>
  //         </Transition>
  //       </div>
  //     )}
  //   </Listbox>
  // );
}

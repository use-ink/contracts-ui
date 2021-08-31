import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import type { DropdownOption } from 'types';
import { classes } from 'ui/util';

interface Props {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  onChange: (o: DropdownOption) => void;
  options?: DropdownOption[];
  placeholder?: React.ReactNode;
  value?: DropdownOption;
}

export const Dropdown = ({
  options,
  placeholder,
  className = '',
  onChange,
  value,
}: Props) => {
  return options ? (
    <Listbox value={value} onChange={onChange}>
      {(({ open }) => ((
      <div className={classes('dropdown', className)}>
        <Listbox.Button className={classes('dropdown-btn option', open ? ' rounded-b-none' : '')}>
          <span>
            {options.length > 0
              ? value?.name
              : placeholder
            }
          </span>
          <ChevronDownIcon aria-hidden="true" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="options">
            {options.map(option => (
              <Listbox.Option
                key={option.value.toString()}
                className={({ active, selected }) => classes('option', active ? 'active' : '', selected ? 'selected' : '')}
                value={option}
              >
                {({ selected }) => {
                  return (
                  <>
                    <span>{option.name}</span>
                    {selected && <CheckIcon aria-hidden="true" />}
                  </>
                )
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
      )))}
    </Listbox>
  ) : null;
};

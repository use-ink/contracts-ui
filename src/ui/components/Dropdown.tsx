import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import type { DropdownOption } from 'types';

interface Props {
  className: React.HTMLAttributes<HTMLDivElement>['className'];
  onChange: (o: DropdownOption) => void;
  options?: DropdownOption[];
  placeholder: string;
  value?: DropdownOption;
}

export const Dropdown = ({
  options,
  placeholder,
  className,
  onChange,
  value,
}: Props) => {
  return options ? (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative mt-1 ${className || ''}`}>
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left dark:text-gray-300 text-gray-500 dark:bg-gray-900 bg-white rounded border dark:border-gray-700 border-gray-200 cursor-default focus:outline-none">
          <span className="block truncate">
            {options.length > 0 ? value && value.name : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 w-full py-1 mt-1 dark:bg-gray-900 border dark:border-gray-stroke border-gray-200 text-base dark:text-gray-300 text-gray-500 bg-white rounded">
            {options.map(option => (
              <Listbox.Option
                key={option.name}
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'dark:text-gray-300'}
                          cursor-default select-none relative py-2 pl-10 pr-4 dark:hover:bg-elevation-2`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                      {option.name}
                    </span>
                    {selected ? (
                      <span
                        className={`${active ? 'text-amber-600' : 'text-amber-600'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  ) : null;
};

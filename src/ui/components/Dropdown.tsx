import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import type { DropdownOption } from 'types';
import { withEllipsis } from 'canvas/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  options?: DropdownOption[];
  selectedOption?: DropdownOption;
  placeholder: string;
  changeHandler: (o: DropdownOption) => void;
  withValueShown?: boolean;
}

export const Dropdown = ({
  options,
  placeholder,
  className,
  changeHandler,
  selectedOption,
  withValueShown = false,
}: Props) => {
  return options ? (
    <Listbox value={selectedOption} onChange={changeHandler}>
      <div className={`relative mt-1 ${className || ''}`}>
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left dark:text-gray-300 text-gray-500 dark:bg-gray-900 bg-white rounded border dark:border-gray-700 border-gray-200 cursor-default focus:outline-none">
          <div className="block truncate">
            <span className="dark:text-gray-300 text-gray-700">
              {options.length > 0 ? selectedOption && selectedOption.name : placeholder}
            </span>
            <p className="text-gray-500 text-sm">
              {withValueShown == true ? withEllipsis(String(selectedOption?.value)) : ''}
            </p>
          </div>
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
          <Listbox.Options className="absolute z-50 w-full overflow-y-auto py-1 mt-1 dark:bg-gray-900 border dark:border-gray-stroke border-gray-200 text-base dark:text-gray-300 text-gray-500 bg-white rounded">
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
                    <div>
                      <span
                        className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}
                      >
                        {option.name}
                      </span>

                      <p className="text-gray-500 text-sm">
                        {withValueShown == true ? withEllipsis(String(option?.value)) : ''}
                      </p>
                    </div>
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

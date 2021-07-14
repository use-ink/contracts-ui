import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import type { DropdownOption } from 'types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  options?: DropdownOption[];
  selectedOption?: DropdownOption;
  placeholder: string;
  changeHandler: (o: DropdownOption) => void;
}

export const Dropdown = ({
  options,
  placeholder,
  className,
  changeHandler,
  selectedOption,
}: Props) => {
  return options ? (
    <Listbox value={selectedOption} onChange={changeHandler}>
      <div className={`relative mt-1 ${className || ''}`}>
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg border border-gray-200 cursor-default focus:outline-none">
          <span className="block truncate">
            {options.length > 0 ? selectedOption && selectedOption.name : placeholder}
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
          <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto border border-gray-200 text-base bg-white rounded-md">
            {options.map(option => (
              <Listbox.Option
                key={option.name}
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4`
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
